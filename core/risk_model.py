from __future__ import annotations

from datetime import timedelta
from typing import Dict, Tuple, Optional
import math

from django.conf import settings
from django.utils import timezone

from .models import KYC, Payment, Vehicle


def _get_linear_coeffs() -> Dict[str, float]:
    """Return intercept and coefficients for the linear risk model.

    The settings may override defaults via RISK_LINEAR_CONFIG, e.g.:
    RISK_LINEAR_CONFIG = {
        'intercept': 600,
        'coeffs': {
            'kyc_approved': 120.0,
            'age_years': 1.5,
            'weekly_returns_10k': -60.0,
            'interest_rate': -40.0,
            'repayment_duration_months': -1.0,
            'down_payment_ratio': 80.0,
            'success_ratio': 200.0,
            'failed_recent_6m': -25.0,
        }
    }
    """
    default = {
        'intercept': 600.0,
        'coeffs': {
            'kyc_approved': 120.0,
            'age_years': 1.5,
            'weekly_returns_10k': -60.0,
            'interest_rate': -40.0,  # interest_rate as fraction (e.g., 0.30)
            'repayment_duration_months': -1.0,
            'down_payment_ratio': 80.0,  # 0.2 -> +16
            'success_ratio': 200.0,      # 1.0 -> +200
            'failed_recent_6m': -25.0,
        },
    }
    cfg = getattr(settings, 'RISK_LINEAR_CONFIG', None)
    if not cfg or not isinstance(cfg, dict):
        return default
    intercept = cfg.get('intercept', default['intercept'])
    coeffs = cfg.get('coeffs', default['coeffs']) or {}
    # Merge with defaults to avoid missing keys
    merged_coeffs = {**default['coeffs'], **coeffs}
    return {'intercept': float(intercept), 'coeffs': {k: float(v) for k, v in merged_coeffs.items()}}


def _get_logistic_coeffs() -> Dict[str, float]:
    """Return intercept and coefficients for the logistic risk model.

    Configurable via settings.RISK_LOGISTIC_CONFIG.
    Features used:
      - kyc_approved (0/1)
      - kyc_under_review (0/1)
      - age_years
      - monthly_income_100k (income divided by 100,000)
      - success_ratio (0..1)
      - failed_recent_6m (count)
      - weekly_returns_10k (weekly returns divided by 10,000)
    """
    default = {
        'intercept': -1.0,
        'coeffs': {
            'kyc_approved': 1.2,
            'kyc_under_review': 0.3,
            'age_years': 0.02,
            'monthly_income_100k': 0.8,
            'success_ratio': 1.5,
            'failed_recent_6m': -0.25,
            'weekly_returns_10k': -0.4,
        },
    }
    cfg = getattr(settings, 'RISK_LOGISTIC_CONFIG', None)
    if not cfg or not isinstance(cfg, dict):
        return default
    intercept = cfg.get('intercept', default['intercept'])
    coeffs = cfg.get('coeffs', default['coeffs']) or {}
    merged_coeffs = {**default['coeffs'], **coeffs}
    return {'intercept': float(intercept), 'coeffs': {k: float(v) for k, v in merged_coeffs.items()}}


def _years_from_dob(dob) -> float:
    if not dob:
        return 0.0
    try:
        today = timezone.now().date()
        years = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return float(max(0, years))
    except Exception:
        return 0.0


def _sigmoid(x: float) -> float:
    try:
        return 1.0 / (1.0 + math.exp(-x))
    except OverflowError:
        # Gracefully handle extreme values
        return 0.0 if x < 0 else 1.0


def compute_driver_credit_score_logistic(applicant_id, vehicle: Optional[Vehicle] = None) -> Dict[str, object]:
    """Compute probability of creditworthiness using a logistic model.

    Returns a dict with:
      - probability: float in [0,1]
      - score: int in [300, 850]
      - category: str in {Excellent, Good, Fair, Poor}
    """
    cfg = _get_logistic_coeffs()
    intercept = float(cfg['intercept'])
    C = cfg['coeffs']

    # KYC and personal features
    kyc = KYC.objects.filter(user_id=applicant_id).first()
    kyc_approved = 1.0 if (kyc and kyc.status == KYC.VerificationStatus.APPROVED) else 0.0
    kyc_under_review = 1.0 if (kyc and kyc.status == KYC.VerificationStatus.UNDER_REVIEW) else 0.0
    age_years = _years_from_dob(getattr(kyc, 'date_of_birth', None)) if kyc else 0.0
    try:
        income = float(getattr(kyc, 'monthly_income', 0.0) or 0.0)
    except Exception:
        income = 0.0
    monthly_income_100k = income / 100000.0

    # Payment history
    total_success = Payment.objects.filter(driver_id=applicant_id, status=Payment.PaymentStatus.SUCCESSFUL).count()
    total_failed = Payment.objects.filter(driver_id=applicant_id, status=Payment.PaymentStatus.FAILED).count()
    total = total_success + total_failed
    success_ratio = float(total_success) / float(total) if total > 0 else 0.0

    six_months_ago = timezone.now() - timedelta(days=6 * 30)
    failed_recent_6m = Payment.objects.filter(
        driver_id=applicant_id,
        status=Payment.PaymentStatus.FAILED,
        payment_date__gte=six_months_ago,
    ).count()

    # Vehicle financials (optional)
    weekly_returns_10k = 0.0
    if vehicle:
        try:
            weekly_returns = float(vehicle.weekly_returns or 0.0)
        except Exception:
            weekly_returns = 0.0
        weekly_returns_10k = weekly_returns / 10000.0

    # Logistic linear combination
    z = intercept
    z += C.get('kyc_approved', 0.0) * kyc_approved
    z += C.get('kyc_under_review', 0.0) * kyc_under_review
    z += C.get('age_years', 0.0) * age_years
    z += C.get('monthly_income_100k', 0.0) * monthly_income_100k
    z += C.get('success_ratio', 0.0) * success_ratio
    z += C.get('failed_recent_6m', 0.0) * float(failed_recent_6m)
    z += C.get('weekly_returns_10k', 0.0) * weekly_returns_10k

    # Debug print of features and linear term for terminal visibility
    print(
        (
            f"[CREDIT LOGISTIC] user={applicant_id} "
            f"features: kyc_approved={kyc_approved}, kyc_under_review={kyc_under_review}, age_years={age_years}, "
            f"monthly_income_100k={monthly_income_100k:.4f}, success_ratio={success_ratio:.4f}, "
            f"failed_recent_6m={failed_recent_6m}, weekly_returns_10k={weekly_returns_10k:.4f}"
        )
    )

    probability = _sigmoid(z)
    score = int(round(300 + probability * 550))
    score = max(300, min(850, score))

    if score >= 750:
        category = 'Excellent'
    elif score >= 650:
        category = 'Good'
    elif score >= 550:
        category = 'Fair'
    else:
        category = 'Poor'

    # Final computation printout
    print(
        (
            f"[CREDIT LOGISTIC] z={z:.4f}, probability={probability:.4f}, score={score}, category={category}"
        )
    )

    return {
        'probability': float(probability),
        'score': int(score),
        'category': category,
    }


def compute_driver_credit_score_linear(applicant_id, vehicle: Vehicle) -> int:
    """Compute credit score using a simple linear regression-style formula.

    Features derive from existing KYC, Payment, and Vehicle fields and combine
    via configurable coefficients. The final score is clamped to [300, 850].
    """
    coeffs_cfg = _get_linear_coeffs()
    intercept = float(coeffs_cfg['intercept'])
    C = coeffs_cfg['coeffs']

    # KYC
    kyc = KYC.objects.filter(user_id=applicant_id).first()
    kyc_approved = 1.0 if (kyc and kyc.status == KYC.VerificationStatus.APPROVED) else 0.0
    age_years = _years_from_dob(getattr(kyc, 'date_of_birth', None)) if kyc else 0.0

    # Payments
    total_success = Payment.objects.filter(driver_id=applicant_id, status=Payment.PaymentStatus.SUCCESSFUL).count()
    total_failed = Payment.objects.filter(driver_id=applicant_id, status=Payment.PaymentStatus.FAILED).count()
    total = total_success + total_failed
    success_ratio = float(total_success) / float(total) if total > 0 else 0.0

    six_months_ago = timezone.now() - timedelta(days=6 * 30)
    failed_recent_6m = Payment.objects.filter(
        driver_id=applicant_id,
        status=Payment.PaymentStatus.FAILED,
        payment_date__gte=six_months_ago,
    ).count()

    # Vehicle financials
    try:
        weekly_returns = float(vehicle.weekly_returns or 0.0)
    except Exception:
        weekly_returns = 0.0
    weekly_returns_10k = weekly_returns / 10000.0

    try:
        interest_rate = float(vehicle.interest_rate or 0.0)
    except Exception:
        interest_rate = 0.0

    try:
        repayment_duration_months = float(vehicle.repayment_duration or 0)
    except Exception:
        repayment_duration_months = 0.0

    try:
        total_cost = float(vehicle.total_cost or 0.0)
        amount_paid = float(vehicle.amount_paid or 0.0)
        down_payment_ratio = (amount_paid / total_cost) if total_cost > 0 else 0.0
    except Exception:
        down_payment_ratio = 0.0

    # Linear combination
    score = intercept
    score += C.get('kyc_approved', 0.0) * kyc_approved
    score += C.get('age_years', 0.0) * age_years
    score += C.get('weekly_returns_10k', 0.0) * weekly_returns_10k
    score += C.get('interest_rate', 0.0) * interest_rate
    score += C.get('repayment_duration_months', 0.0) * repayment_duration_months
    score += C.get('down_payment_ratio', 0.0) * down_payment_ratio
    score += C.get('success_ratio', 0.0) * success_ratio
    score += C.get('failed_recent_6m', 0.0) * float(failed_recent_6m)

    # Clamp and round
    score = int(round(max(300.0, min(850.0, score))))
    return score