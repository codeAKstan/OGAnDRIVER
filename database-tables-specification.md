# Oga Driver Platform - Database Tables Specification

## Table 1: USER

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| USER | id | UUID | 36 | primary key | |
| | username | varchar | 150 | unique | |
| | first_name | varchar | 150 | | |
| | last_name | varchar | 150 | | |
| | email | varchar | 254 | unique | |
| | password | varchar | 128 | | |
| | role | varchar | 50 | | |
| | phone_number | varchar | 15 | | |
| | is_active | boolean | 1 | | |
| | is_staff | boolean | 1 | | |
| | is_superuser | boolean | 1 | | |
| | date_joined | datetime | | | |
| | last_login | datetime | | | |

## Table 2: VEHICLE

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| VEHICLE | id | UUID | 36 | primary key | |
| | owner_id | UUID | 36 | foreign key | USER |
| | driver_id | UUID | 36 | foreign key | USER |
| | vehicle_type | varchar | 50 | | |
| | model_name | varchar | 100 | | |
| | registration_number | varchar | 20 | unique | |
| | photo_url | varchar | 200 | | |
| | total_cost | decimal | 10,2 | | |
| | amount_paid | decimal | 10,2 | | |
| | is_active | boolean | 1 | | |
| | is_fully_paid | boolean | 1 | | |
| | created_at | datetime | | | |
| | updated_at | datetime | | | |

## Table 3: DRIVER_APPLICATION

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| DRIVER_APPLICATION | id | UUID | 36 | primary key | |
| | applicant_id | UUID | 36 | foreign key | USER |
| | vehicle_id | UUID | 36 | foreign key | VEHICLE |
| | status | varchar | 50 | | |
| | risk_score | integer | 11 | | |
| | application_date | datetime | | | |
| | decision_date | datetime | | | |

## Table 4: PAYMENT

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| PAYMENT | id | UUID | 36 | primary key | |
| | transaction_id | varchar | 100 | unique | |
| | vehicle_id | UUID | 36 | foreign key | VEHICLE |
| | driver_id | UUID | 36 | foreign key | USER |
| | amount | decimal | 10,2 | | |
| | payment_date | datetime | | | |
| | status | varchar | 50 | | |

## Table 5: DRIVER_PROFILE (Extended KYC Information)

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| DRIVER_PROFILE | id | UUID | 36 | primary key | |
| | user_id | UUID | 36 | foreign key | USER |
| | date_of_birth | date | | | |
| | gender | varchar | 10 | | |
| | marital_status | varchar | 20 | | |
| | nationality | varchar | 50 | | |
| | alternate_phone | varchar | 15 | | |
| | address | text | 500 | | |
| | city | varchar | 100 | | |
| | state | varchar | 100 | | |
| | id_type | varchar | 50 | | |
| | id_number | varchar | 50 | | |
| | license_number | varchar | 50 | | |
| | license_expiry | date | | | |
| | years_of_experience | integer | 11 | | |
| | emergency_name | varchar | 100 | | |
| | emergency_phone | varchar | 15 | | |
| | emergency_relationship | varchar | 50 | | |
| | previous_employment | text | 1000 | | |
| | criminal_record | varchar | 10 | | |
| | medical_conditions | text | 500 | | |
| | created_at | datetime | | | |
| | updated_at | datetime | | | |

## Table 6: VEHICLE_DOCUMENT

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| VEHICLE_DOCUMENT | id | UUID | 36 | primary key | |
| | vehicle_id | UUID | 36 | foreign key | VEHICLE |
| | document_type | varchar | 50 | | |
| | document_url | varchar | 500 | | |
| | document_number | varchar | 100 | | |
| | expiry_date | date | | | |
| | is_verified | boolean | 1 | | |
| | uploaded_at | datetime | | | |

## Table 7: DRIVER_DOCUMENT

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| DRIVER_DOCUMENT | id | UUID | 36 | primary key | |
| | driver_id | UUID | 36 | foreign key | USER |
| | document_type | varchar | 50 | | |
| | document_url | varchar | 500 | | |
| | document_number | varchar | 100 | | |
| | expiry_date | date | | | |
| | is_verified | boolean | 1 | | |
| | uploaded_at | datetime | | | |

## Table 8: FINANCIAL_REPORT

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| FINANCIAL_REPORT | id | UUID | 36 | primary key | |
| | owner_id | UUID | 36 | foreign key | USER |
| | vehicle_id | UUID | 36 | foreign key | VEHICLE |
| | report_month | integer | 11 | | |
| | report_year | integer | 11 | | |
| | total_payments_received | decimal | 10,2 | | |
| | total_expenses | decimal | 10,2 | | |
| | net_profit | decimal | 10,2 | | |
| | payment_count | integer | 11 | | |
| | generated_at | datetime | | | |

## Table 9: NOTIFICATION

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| NOTIFICATION | id | UUID | 36 | primary key | |
| | user_id | UUID | 36 | foreign key | USER |
| | title | varchar | 200 | | |
| | message | text | 1000 | | |
| | notification_type | varchar | 50 | | |
| | is_read | boolean | 1 | | |
| | created_at | datetime | | | |
| | read_at | datetime | | | |

## Table 10: ACTIVITY_LOG

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| ACTIVITY_LOG | id | UUID | 36 | primary key | |
| | user_id | UUID | 36 | foreign key | USER |
| | action_type | varchar | 100 | | |
| | description | text | 500 | | |
| | ip_address | varchar | 45 | | |
| | user_agent | varchar | 500 | | |
| | created_at | datetime | | | |

## Table 11: SYSTEM_SETTINGS

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| SYSTEM_SETTINGS | id | UUID | 36 | primary key | |
| | setting_key | varchar | 100 | unique | |
| | setting_value | text | 1000 | | |
| | setting_type | varchar | 50 | | |
| | description | text | 500 | | |
| | is_active | boolean | 1 | | |
| | created_at | datetime | | | |
| | updated_at | datetime | | | |

## Table 12: VEHICLE_MAINTENANCE

| Table name | Attribute name | Type of data | Length of data | Type of key | Foreign key referenced table |
|------------|----------------|--------------|----------------|-------------|------------------------------|
| VEHICLE_MAINTENANCE | id | UUID | 36 | primary key | |
| | vehicle_id | UUID | 36 | foreign key | VEHICLE |
| | maintenance_type | varchar | 100 | | |
| | description | text | 500 | | |
| | cost | decimal | 10,2 | | |
| | maintenance_date | date | | | |
| | next_maintenance_date | date | | | |
| | performed_by | varchar | 200 | | |
| | created_at | datetime | | | |

---

## Data Type Definitions:

- **UUID**: Universally Unique Identifier (36 characters)
- **varchar(n)**: Variable character string with maximum length n
- **text**: Large text field for longer content
- **decimal(m,d)**: Decimal number with m total digits and d decimal places
- **integer**: Whole number (typically 32-bit)
- **boolean**: True/False value (1 bit)
- **date**: Date value (YYYY-MM-DD)
- **datetime**: Date and time value (YYYY-MM-DD HH:MM:SS)

## Key Relationships:

1. **USER** → **VEHICLE** (One-to-Many: One owner can have multiple vehicles)
2. **USER** → **VEHICLE** (One-to-One: One driver can be assigned to one vehicle)
3. **USER** → **DRIVER_APPLICATION** (One-to-Many: One driver can apply for multiple vehicles)
4. **VEHICLE** → **DRIVER_APPLICATION** (One-to-Many: One vehicle can have multiple applications)
5. **USER** → **PAYMENT** (One-to-Many: One driver can make multiple payments)
6. **VEHICLE** → **PAYMENT** (One-to-Many: One vehicle can receive multiple payments)
7. **USER** → **DRIVER_PROFILE** (One-to-One: Each driver has one profile)
8. **VEHICLE** → **VEHICLE_DOCUMENT** (One-to-Many: One vehicle can have multiple documents)
9. **USER** → **DRIVER_DOCUMENT** (One-to-Many: One driver can have multiple documents)
10. **USER** → **FINANCIAL_REPORT** (One-to-Many: One owner can have multiple reports)
11. **VEHICLE** → **FINANCIAL_REPORT** (One-to-Many: One vehicle can have multiple reports)
12. **USER** → **NOTIFICATION** (One-to-Many: One user can have multiple notifications)
13. **USER** → **ACTIVITY_LOG** (One-to-Many: One user can have multiple activity logs)
14. **VEHICLE** → **VEHICLE_MAINTENANCE** (One-to-Many: One vehicle can have multiple maintenance records)

## Enum Values:

### User Roles:
- OGA (Owner)
- DRIVER (Driver)
- ADMIN (Administrator)

### Vehicle Types:
- KEKE (Tricycle)
- BUS (Bus)
- BIKE (Motorcycle)

### Application Status:
- PENDING
- APPROVED
- REJECTED

### Payment Status:
- SUCCESSFUL
- FAILED

### Document Types:
- LICENSE (Driver's License)
- ID_CARD (National ID)
- PASSPORT (International Passport)
- VEHICLE_REGISTRATION
- INSURANCE_CERTIFICATE
- ROADWORTHINESS_CERTIFICATE

### Notification Types:
- PAYMENT_RECEIVED
- APPLICATION_STATUS
- MAINTENANCE_REMINDER
- SYSTEM_ALERT
- WELCOME_MESSAGE

### Activity Types:
- LOGIN
- LOGOUT
- VEHICLE_ADDED
- PAYMENT_MADE
- APPLICATION_SUBMITTED
- PROFILE_UPDATED
- DOCUMENT_UPLOADED