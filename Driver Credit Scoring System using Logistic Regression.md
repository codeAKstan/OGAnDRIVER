# Driver Credit Scoring System using Logistic Regression

## Overview
- The backend computes creditworthiness using a logistic regression model implemented in `core/risk_model.py::compute_driver_credit_score_logistic`.
- It builds a linear term `z` from domain features and configured coefficients, applies a sigmoid to obtain a probability `p`, then maps `p` to a credit score in the 300–850 range.

## Model Specification
- Linear term: `z = intercept + Σ(coeff_i × feature_i)`.
- Sigmoid: `p = 1 / (1 + exp(-z))`.
- Score mapping: `score = 300 + p × 550`, clamped to `[300, 850]`.
- Category bands:
  - `Excellent` if score ≥ 750
  - `Good` if 650 ≤ score < 750
  - `Fair` if 550 ≤ score < 650
  - `Poor` otherwise

## Features and Scaling
- `kyc_approved`: 1 if KYC is approved, else 0.
- `kyc_under_review`: 1 if KYC is under review, else 0.
- `age_years`: computed from `KYC.date_of_birth`.
- `monthly_income_100k`: `monthly_income / 100000`.
- `success_ratio`: successful payments / total payments (0–1).
- `failed_recent_6m`: count of failed payments in the last 6 months.
- `weekly_returns_10k`: `vehicle.weekly_returns / 10000`.

Scaling rationale:
- Currency features are divided by fixed units (100k for monthly income, 10k for weekly returns) to keep `z` in a sensible range and make coefficients interpretable (effects per 100k or per 10k).

## Coefficients and Intercept (Configuration)
- Values are defined in `backend/settings.py::RISK_LOGISTIC_CONFIG` and loaded via `core/risk_model.py::_get_logistic_coeffs()`.
- Current configuration:

```
RISK_LOGISTIC_CONFIG = {
  'intercept': -1.0,
  'coeffs': {
    'kyc_approved': 1.2,
    'kyc_under_review': 0.3,
    'age_years': 0.02,
    'monthly_income_100k': 0.8,
    'success_ratio': 1.5,
    'failed_recent_6m': -0.25,
    'weekly_returns_10k': -0.4,
  }
}
```

Interpretation:
- Positive coefficients (e.g., `kyc_approved`, `monthly_income_100k`, `success_ratio`) increase log-odds and thus probability.
- Negative coefficients (e.g., `failed_recent_6m`, `weekly_returns_10k`) decrease log-odds and probability.
- `intercept = -1.0` sets a conservative baseline; without positive signals, probability is below 0.5.

## Data Sources
- `KYC`: verification status, date of birth, monthly income.
- `Payment`: historical successful/failed counts, recent failures in 6 months.
- `Vehicle`: weekly returns (optional; absent vehicle is treated as zero contribution).
- Bank statements: currently uploaded and stored, but not parsed into features; `monthly_income` is used as provided.

## Handling Missing Data
- Missing vehicle → `weekly_returns_10k = 0`.
- No payment history → `success_ratio = 0`, `failed_recent_6m = 0`.
- Missing DOB → `age_years = 0`.
- Missing income → `monthly_income_100k = 0`.

## Worked Example
Profile:
- KYC approved, age 35, monthly income ₦250,000, new user (no payments), weekly returns ₦56,000.

Feature values:
- `kyc_approved = 1`, `kyc_under_review = 0`
- `age_years = 35`
- `monthly_income_100k = 250000 / 100000 = 2.5`
- `success_ratio = 0.0`, `failed_recent_6m = 0`
- `weekly_returns_10k = 56000 / 10000 = 5.6`

Coefficients and intercept (from settings):
- `intercept = -1.0`
- `kyc_approved = 1.2`, `kyc_under_review = 0.3`, `age_years = 0.02`
- `monthly_income_100k = 0.8`, `success_ratio = 1.5`
- `failed_recent_6m = -0.25`, `weekly_returns_10k = -0.4`

Linear term `z`:
- Start: `z = -1.0`
- `+ 1.2 × 1 = +1.20`
- `+ 0.3 × 0 = +0.00`
- `+ 0.02 × 35 = +0.70`
- `+ 0.8 × 2.5 = +2.00`
- `+ 1.5 × 0.0 = +0.00`
- `+ (-0.25) × 0 = +0.00`
- `+ (-0.4) × 5.6 = -2.24`
- Total: `z = -1.0 + 1.20 + 0.00 + 0.70 + 2.00 + 0.00 + 0.00 - 2.24 = 0.66`

Probability and score:
- `p = 1 / (1 + exp(-0.66)) ≈ 0.659`
- `score = 300 + 0.659 × 550 ≈ 662` → Category `Good` (650–749)

## API Usage
- `core/views.py::credit_risk_score`: always computes using the logistic model and returns `{probability, score, category}`.
- `core/views.py::submit_application`: uses logistic scoring for new applications and backfills pending ones missing `risk_score`.

## Tuning and Retraining
- These defaults are domain-guided starting points to produce stable probabilities and score distributions.
- For data-driven calibration:
  - Collect labeled outcomes (e.g., default vs. non-default).
  - Fit a logistic regression with the same feature scaling.
  - Export learned `intercept` and `coeffs` into `RISK_LOGISTIC_CONFIG`.
  - Validate acceptance rates and score bands; adjust `intercept` first for overall distribution, then per-feature coefficients for sensitivity.

## Notes
- If policy prefers burden to be modeled as net capacity (income minus weekly burden), replace `weekly_returns_10k` with a net feature and retune coefficients.
- Bank statement parsing is not yet integrated; future work can extract structured metrics to enrich features and improve accuracy.