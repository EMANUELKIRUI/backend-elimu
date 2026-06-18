# 🚀 Elimu ERP - Quick Reference Guide

## Login Details

### Test Credentials
| Role | Username | Password | Email |
|------|----------|----------|-------|
| Principal | principal | Principal@123 | principal@premieracademy.co.ke |
| Teacher | teacher1 | Teacher@123 | teacher1@premieracademy.co.ke |
| Admin | admin-school | Admin@123 | admin@premieracademy.co.ke |
| Super Admin | superadmin | SuperAdmin@12345 | superadmin@africaschool.local |

## Quick API Reference

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "principal", "password": "Principal@123"}'

# Refresh Token
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

### Students
```bash
# List all students
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"

# Get student by ID
curl http://localhost:3000/api/v1/students/{id} \
  -H "Authorization: Bearer $TOKEN"

# Get student marks
curl http://localhost:3000/api/v1/students/{id}/marks \
  -H "Authorization: Bearer $TOKEN"

# Get student attendance
curl http://localhost:3000/api/v1/students/{id}/attendance \
  -H "Authorization: Bearer $TOKEN"
```

### Academics
```bash
# List exams
curl http://localhost:3000/api/v1/academics/exams \
  -H "Authorization: Bearer $TOKEN"

# Get exam details
curl http://localhost:3000/api/v1/academics/exams/{id} \
  -H "Authorization: Bearer $TOKEN"

# List marks
curl http://localhost:3000/api/v1/academics/marks \
  -H "Authorization: Bearer $TOKEN"
```

### Finance
```bash
# List invoices
curl http://localhost:3000/api/v1/finance/invoices \
  -H "Authorization: Bearer $TOKEN"

# Get invoice
curl http://localhost:3000/api/v1/finance/invoices/{id} \
  -H "Authorization: Bearer $TOKEN"

# List payments
curl http://localhost:3000/api/v1/finance/payments \
  -H "Authorization: Bearer $TOKEN"

# List receipts
curl http://localhost:3000/api/v1/finance/receipts \
  -H "Authorization: Bearer $TOKEN"
```

### Attendance
```bash
# Record student attendance
curl -X POST http://localhost:3000/api/v1/attendance/student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "studentId": "...",
    "date": "2024-06-18",
    "status": "PRESENT"
  }'

# Get student attendance
curl "http://localhost:3000/api/v1/attendance/student?studentId={id}" \
  -H "Authorization: Bearer $TOKEN"
```

### HR
```bash
# List employees
curl http://localhost:3000/api/v1/hr/employees \
  -H "Authorization: Bearer $TOKEN"

# Get employee
curl http://localhost:3000/api/v1/hr/employees/{id} \
  -H "Authorization: Bearer $TOKEN"

# Get payroll
curl http://localhost:3000/api/v1/hr/payroll \
  -H "Authorization: Bearer $TOKEN"
```

## Test Data Summary

### School Info
- **Name:** Premier Academy
- **Code:** PREM-001
- **Country:** Kenya
- **County:** Nairobi
- **Email:** info@premieracademy.co.ke
- **Phone:** +254712345678

### Students (5 Total)
- Student1 Kipchoge (PREM-2024002) - Form 1 Stream B
- Student2 Kipchoge (PREM-2024003) - Form 1 Stream A
- Student3 Kipchoge (PREM-2024004) - Form 1 Stream B
- Student4 Kipchoge (PREM-2024005) - Form 1 Stream A
- Student5 Kipchoge (PREM-2024006) - Form 1 Stream B

### Classes
- Form 1 (2 streams: A, B)
- Form 2

### Subjects
- Mathematics (100 marks)
- English (100 marks)
- Science (100 marks)

### Academic Year
- Year: 2024
- Term 1: Jan 15 - Apr 5, 2024
- Term 2: Apr 15 - Aug 2, 2024

### Finance
- Total Billed: KES 475,000
- Total Paid: KES 0
- Outstanding: KES 475,000

### Exam
- Term 1 Exams (3 subjects, 15 total marks)

## Common Workflows

### 1. Login & Access Dashboard
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "principal", "password": "Principal@123"}' | jq -r '.accessToken')

# 2. Get students
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Get school analytics
curl http://localhost:3000/api/v1/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 2. Record Student Marks
```bash
# 1. Get exam ID
curl http://localhost:3000/api/v1/academics/exams \
  -H "Authorization: Bearer $TOKEN" | jq '.[0].id'

# 2. Get student ID
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" | jq '.[0].id'

# 3. Get subject ID
curl http://localhost:3000/api/v1/subjects \
  -H "Authorization: Bearer $TOKEN" | jq '.[0].id'

# 4. Record mark
curl -X POST http://localhost:3000/api/v1/academics/marks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "examId": "...",
    "studentId": "...",
    "subjectId": "...",
    "score": 85
  }'
```

### 3. Process Student Payment
```bash
# 1. Get invoice ID
curl http://localhost:3000/api/v1/finance/invoices \
  -H "Authorization: Bearer $TOKEN" | jq '.[0].id'

# 2. Create payment
curl -X POST http://localhost:3000/api/v1/finance/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "invoiceId": "...",
    "amount": 95000,
    "method": "mpesa",
    "reference": "MPESA-123456"
  }'

# 3. Generate receipt
curl http://localhost:3000/api/v1/finance/receipts \
  -H "Authorization: Bearer $TOKEN" | jq '.[-1]'
```

## Permissions Overview

### Principal
✅ View all students & staff
✅ Record and approve marks
✅ Access financial dashboard
✅ Approve academic decisions
✅ View analytics & reports
✅ Send communications

### Teacher
✅ View assigned students
✅ Record student marks
✅ View student performance
✅ Track attendance
✅ Submit marks for approval
✅ Send class communications

### School Admin
✅ Manage users
✅ Configure school settings
✅ Generate reports
✅ View system audit logs
✅ Manage roles & permissions

### Platform Admin
✅ All permissions
✅ Multi-school management
✅ System configuration
✅ User & role management
✅ Platform administration

## Useful Links

- **Health Check:** http://localhost:3000/health
- **Root Endpoint:** http://localhost:3000/
- **API Base:** http://localhost:3000/api/v1

## Troubleshooting Checklist

- [ ] Is the backend running? (`npm run start:dev`)
- [ ] Can you reach the health endpoint? (`/health`)
- [ ] Are your credentials correct?
- [ ] Is your access token still valid? (15-minute expiry)
- [ ] Do you have the correct permissions for the action?
- [ ] Is the school ID correct in your request?
- [ ] Are required fields included in POST requests?

## Key Dates

- **Academic Year:** 2024
- **Term 1 Start:** January 15, 2024
- **Term 1 End:** April 5, 2024
- **Term 2 Start:** April 15, 2024
- **Term 2 End:** August 2, 2024
- **Invoice Due Date:** February 28, 2024

## Financial Summary

**Per Student Fees:**
- Tuition: KES 50,000
- Boarding: KES 30,000
- Lunch: KES 10,000
- Sports: KES 5,000
- **Total: KES 95,000**

## Success Indicators

✅ System Running
- [ ] Backend starts without errors
- [ ] Health endpoint returns 200
- [ ] Can login with credentials
- [ ] Can access student data
- [ ] Can view financial records
- [ ] Can see academic marks
- [ ] Can track attendance

---

For detailed information, see [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)
