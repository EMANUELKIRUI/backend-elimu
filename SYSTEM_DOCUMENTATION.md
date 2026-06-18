# 📚 Elimu ERP System - Complete User & Developer Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Quick Start](#quick-start)
3. [Authentication](#authentication)
4. [Module Documentation](#module-documentation)
5. [API Endpoints Reference](#api-endpoints-reference)
6. [Role-Based Access Control](#role-based-access-control)
7. [Testing Guide](#testing-guide)
8. [Troubleshooting](#troubleshooting)

---

## System Overview

**Elimu ERP** is a comprehensive enterprise resource planning system designed for multi-tenant school management across East Africa. It provides complete management solutions for academics, finance, HR, operations, and more.

### Key Features

✅ **Multi-School Support** - Manage multiple schools from one platform  
✅ **Role-Based Access Control** - Fine-grained permission management  
✅ **Academic Management** - Exams, marks, curriculum tracking  
✅ **Financial Operations** - Invoicing, payments, receipts, expense tracking  
✅ **HR Management** - Employee records, contracts, payroll, leave management  
✅ **Attendance Tracking** - Student and staff attendance monitoring  
✅ **Communication** - SMS and email notifications via Upstash Redis  
✅ **Analytics & Reporting** - Comprehensive dashboards and reports  
✅ **Audit Logging** - Complete system activity tracking  

### Technology Stack

- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Cache/Queue:** Upstash Redis REST API
- **Authentication:** JWT with access & refresh tokens
- **API Documentation:** Swagger/OpenAPI

---

## Quick Start

### 1. Access the System

**Base URL:** `http://localhost:3000`

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "backend-elimu",
  "timestamp": "2026-06-18T10:11:02.136Z"
}
```

### 2. Login

**Endpoint:** `POST /api/v1/auth/login`

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "principal",
    "password": "Principal@123"
  }'
```

**Response:** Returns `accessToken`, `refreshToken`, and user information

### 3. Use the API

Include the `accessToken` in all subsequent requests:

```bash
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Authentication

### Login Credentials

| Role | Username | Email | Password |
|------|----------|-------|----------|
| **Principal** | principal | principal@premieracademy.co.ke | Principal@123 |
| **Teacher** | teacher1 | teacher1@premieracademy.co.ke | Teacher@123 |
| **School Admin** | admin-school | admin@premieracademy.co.ke | Admin@123 |
| **Platform Admin** | superadmin | superadmin@africaschool.local | SuperAdmin@12345 |

### Token Management

**Access Token:**
- Validity: 15 minutes
- Contains user ID, school ID, roles, and permissions
- Used for API requests

**Refresh Token:**
- Validity: 30 days
- Used to obtain new access tokens
- Endpoint: `POST /api/v1/auth/refresh`

### Refresh Token Example

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## Module Documentation

### 1. 📚 Academic Management Module

#### Overview
Manages curriculum, classes, exams, marks, and student performance tracking.

#### Key Entities
- **Academic Years** - School calendar years (e.g., 2024)
- **Terms** - School terms within academic year (e.g., Term 1, Term 2)
- **Classes** - Grade levels (Form 1, Form 2, etc.)
- **Streams** - Class subdivisions (Stream A, Stream B)
- **Subjects** - Course subjects with assessment modes
- **Exams** - Examination records with multiple subjects
- **Marks** - Student performance scoring

#### Common Endpoints

```bash
# Get all students
GET /api/v1/students

# Get student by ID
GET /api/v1/students/{id}

# Get exams for school
GET /api/v1/academics/exams

# Get marks for exam
GET /api/v1/academics/exams/{examId}/marks

# Get student marks
GET /api/v1/students/{studentId}/marks
```

#### Workflow Example

1. **Create Academic Year**
   ```
   Name: 2024
   Start Date: 2024-01-01
   End Date: 2024-12-31
   ```

2. **Create Term**
   ```
   Academic Year: 2024
   Term Name: Term 1
   Start: 2024-01-15
   End: 2024-04-05
   ```

3. **Create Exam**
   ```
   Academic Year: 2024
   Term: Term 1
   Name: Midterm Exams
   ```

4. **Add Subjects to Exam**
   ```
   Subject: Mathematics (Max Marks: 100)
   Subject: English (Max Marks: 100)
   Subject: Science (Max Marks: 100)
   ```

5. **Record Marks**
   ```
   Student: Student1 Kipchoge
   Subject: Mathematics
   Score: 85
   Grade: A
   ```

---

### 2. 💰 Finance Module

#### Overview
Manages fees, invoicing, payments, receipts, and financial reporting.

#### Key Entities
- **Fee Structures** - Define fees for classes/terms
- **Invoices** - Student billing records
- **Payments** - Payment receipts from students
- **Payment Allocations** - Link payments to invoices
- **Expenses** - School expenditures
- **Receipts** - Payment confirmations

#### Common Endpoints

```bash
# Get invoices
GET /api/v1/finance/invoices

# Get student invoice
GET /api/v1/finance/invoices/{invoiceId}

# Create payment
POST /api/v1/finance/payments
Body: {
  "studentId": "...",
  "invoiceId": "...",
  "amount": 95000,
  "method": "mpesa",
  "reference": "MPESA-123456"
}

# Get receipts
GET /api/v1/finance/receipts

# Get expenses
GET /api/v1/finance/expenses
```

#### Sample Fee Structure

```
School: Premier Academy
Class: Form 1
Items:
├─ Tuition:      KES 50,000
├─ Boarding:     KES 30,000
├─ Lunch:        KES 10,000
└─ Sports:       KES 5,000
  Total:          KES 95,000
```

#### Payment Workflow

1. **Create Invoice**
   - Student: Student1 Kipchoge
   - Amount: KES 95,000
   - Due Date: 2024-02-28

2. **Record Payment**
   - Payment Amount: KES 47,500 (partial)
   - Method: M-Pesa
   - Reference: MPESA-100001

3. **Generate Receipt**
   - Receipt Number: REC-2024-5001
   - Amount Paid: KES 47,500
   - Balance: KES 47,500

---

### 3. 👥 Student Management Module

#### Overview
Manages student records, admissions, guardians, medical records, and documents.

#### Key Entities
- **Students** - Student profiles with admission tracking
- **Guardians** - Parent/guardian information
- **Student-Guardian Links** - Relationship mapping
- **Medical Records** - Health information
- **Student Documents** - Academic certificates, ID scans, etc.
- **Student Transfers** - Transfer history between schools

#### Common Endpoints

```bash
# Get all students
GET /api/v1/students

# Get student details
GET /api/v1/students/{studentId}

# Get student guardians
GET /api/v1/students/{studentId}/guardians

# Get medical records
GET /api/v1/students/{studentId}/medical-records

# Get student documents
GET /api/v1/students/{studentId}/documents

# Get student attendance
GET /api/v1/students/{studentId}/attendance

# Get student marks
GET /api/v1/students/{studentId}/marks
```

#### Student Data Fields

```json
{
  "firstName": "Student1",
  "lastName": "Kipchoge",
  "admissionNumber": "PREM-2024002",
  "gender": "M",
  "dateOfBirth": "2008-05-15",
  "class": "Form 1",
  "stream": "Stream A",
  "status": "ACTIVE"
}
```

---

### 4. ⏱️ Attendance Module

#### Overview
Tracks attendance for both students and staff with detailed reporting.

#### Key Entities
- **Student Attendance** - Daily student presence records
- **Staff Attendance** - Employee presence tracking

#### Common Endpoints

```bash
# Record student attendance
POST /api/v1/attendance/student
Body: {
  "studentId": "...",
  "date": "2024-06-18",
  "status": "PRESENT",
  "notes": ""
}

# Get student attendance
GET /api/v1/attendance/student?studentId={id}&from={date}&to={date}

# Record staff attendance
POST /api/v1/attendance/staff
Body: {
  "userId": "...",
  "date": "2024-06-18",
  "status": "PRESENT"
}

# Get attendance report
GET /api/v1/attendance/report?type=student&from={date}&to={date}
```

#### Attendance Status Options

- `PRESENT` - Student/Staff present
- `ABSENT` - Student/Staff absent
- `LATE` - Student/Staff arrived late
- `EXCUSED` - Excused absence

---

### 5. 👨‍💼 HR Module

#### Overview
Manages employee records, contracts, payroll, leave requests, and performance.

#### Key Entities
- **Employees** - Staff member records
- **Contracts** - Employment contracts
- **Leave Requests** - Time off requests
- **Payroll** - Salary calculations and payment
- **Performance Reviews** - Staff evaluations

#### Common Endpoints

```bash
# Get employees
GET /api/v1/hr/employees

# Get employee details
GET /api/v1/hr/employees/{employeeId}

# Get employee contracts
GET /api/v1/hr/employees/{employeeId}/contracts

# Get leave requests
GET /api/v1/hr/leave-requests

# Request leave
POST /api/v1/hr/leave-requests
Body: {
  "employeeId": "...",
  "type": "annual",
  "startsAt": "2024-07-01",
  "endsAt": "2024-07-10",
  "reason": "Family vacation"
}

# Get payroll
GET /api/v1/hr/payroll
```

---

### 6. 📞 Communication Module

#### Overview
Sends SMS and email notifications to students and staff using Upstash Redis.

#### Key Features
- Message queuing via Upstash Redis
- SMS and Email support
- Message templates
- Bulk sending capabilities

#### Common Endpoints

```bash
# Send message
POST /api/v1/communication/send
Body: {
  "channel": "sms",
  "recipients": ["phone_numbers"],
  "message": "Your exam results are ready"
}

# Get message history
GET /api/v1/communication/logs?channel=sms

# Get email logs
GET /api/v1/communication/email-logs
```

#### Message Templates

- Exam Notifications
- Payment Reminders
- Attendance Updates
- Academic Performance
- System Alerts

---

### 7. 📊 Analytics & Reporting Module

#### Overview
Provides dashboards and comprehensive reporting for decision making.

#### Key Reports

- **Student Performance** - Grade trends and analysis
- **Financial Dashboard** - Revenue, payments, balance
- **Attendance Reports** - Presence patterns and trends
- **Enrollment Analytics** - Student numbers by class/stream
- **Academic Analytics** - Exam performance statistics

#### Common Endpoints

```bash
# Get analytics dashboard
GET /api/v1/analytics/dashboard

# Get student performance report
GET /api/v1/analytics/students/performance

# Get financial report
GET /api/v1/analytics/finance/summary

# Get attendance statistics
GET /api/v1/analytics/attendance/statistics
```

---

### 8. 🔧 Operations Module

#### Overview
Manages school operations, maintenance, assets, and facilities.

#### Key Entities
- **Assets** - Equipment and property inventory
- **Inventory** - Consumables and stock
- **Facilities** - Buildings, classrooms, labs
- **Maintenance Records** - Repair and upkeep logs
- **Inspections** - Facility inspections and checklists

#### Common Endpoints

```bash
# Get assets
GET /api/v1/operations/assets

# Get inventory items
GET /api/v1/operations/inventory

# Get maintenance records
GET /api/v1/operations/maintenance

# Record asset assignment
POST /api/v1/operations/assets/{assetId}/assign
Body: {
  "userId": "...",
  "assignedAt": "2024-06-18"
}
```

---

### 9. 📚 Learning Management System (LMS)

#### Overview
Manages online learning content, assignments, and quizzes.

#### Key Entities
- **Courses** - Learning courses
- **Lessons** - Course content
- **Assignments** - Student tasks
- **Quizzes** - Online assessments

#### Common Endpoints

```bash
# Get courses
GET /api/v1/lms/courses

# Get course lessons
GET /api/v1/lms/courses/{courseId}/lessons

# Get assignments
GET /api/v1/lms/assignments

# Submit assignment
POST /api/v1/lms/assignments/{assignmentId}/submit
Body: {
  "content": "...",
  "fileUrl": "..."
}

# Get quiz attempts
GET /api/v1/lms/quizzes/{quizId}/attempts
```

---

### 10. 📖 Library Management Module

#### Overview
Manages library books, borrowing, and returns.

#### Key Entities
- **Books** - Library catalog
- **Borrowings** - Book checkout records
- **Returns** - Book returns

#### Common Endpoints

```bash
# Get library books
GET /api/v1/library/books

# Borrow book
POST /api/v1/library/borrowings
Body: {
  "bookId": "...",
  "studentId": "...",
  "borrowedAt": "2024-06-18"
}

# Return book
POST /api/v1/library/borrowings/{borrowingId}/return

# Get borrowing history
GET /api/v1/library/borrowings?studentId={id}
```

---

### 11. 🚍 Transport Management Module

#### Overview
Manages student transportation, routes, and vehicles.

#### Key Entities
- **Routes** - Transport routes
- **Vehicles** - School transport vehicles
- **Drivers** - Transport staff
- **Student Assignments** - Route assignments

#### Common Endpoints

```bash
# Get routes
GET /api/v1/transport/routes

# Get vehicles
GET /api/v1/transport/vehicles

# Get drivers
GET /api/v1/transport/drivers

# Assign student to route
POST /api/v1/transport/assignments
Body: {
  "studentId": "...",
  "routeId": "..."
}
```

---

### 12. 🏠 Boarding Management Module

#### Overview
Manages student boarding, bed allocations, and dormitory assignments.

#### Key Entities
- **Dormitories** - Boarding houses
- **Beds** - Room beds
- **Bed Allocations** - Student bed assignments

#### Common Endpoints

```bash
# Get dormitories
GET /api/v1/boarding/dormitories

# Get bed allocations
GET /api/v1/boarding/allocations

# Allocate bed to student
POST /api/v1/boarding/allocations
Body: {
  "studentId": "...",
  "dormitoryId": "...",
  "bedNumber": "..."
}
```

---

## API Endpoints Reference

### Authentication Endpoints

```
POST   /api/v1/auth/login              - User login
POST   /api/v1/auth/refresh            - Refresh access token
POST   /api/v1/auth/logout             - User logout
```

### Student Endpoints

```
GET    /api/v1/students                - List all students
GET    /api/v1/students/{id}           - Get student details
POST   /api/v1/students                - Create student
PUT    /api/v1/students/{id}           - Update student
DELETE /api/v1/students/{id}           - Delete student
GET    /api/v1/students/{id}/guardians - Get guardians
GET    /api/v1/students/{id}/attendance - Get attendance
GET    /api/v1/students/{id}/marks     - Get marks
```

### Academic Endpoints

```
GET    /api/v1/academics/exams         - List exams
GET    /api/v1/academics/exams/{id}    - Get exam details
POST   /api/v1/academics/exams         - Create exam
GET    /api/v1/academics/marks         - List marks
POST   /api/v1/academics/marks         - Record marks
```

### Finance Endpoints

```
GET    /api/v1/finance/invoices        - List invoices
GET    /api/v1/finance/invoices/{id}   - Get invoice
POST   /api/v1/finance/payments        - Record payment
GET    /api/v1/finance/receipts        - List receipts
```

### Attendance Endpoints

```
POST   /api/v1/attendance/student      - Record student attendance
GET    /api/v1/attendance/student      - Get student attendance
POST   /api/v1/attendance/staff        - Record staff attendance
GET    /api/v1/attendance/staff        - Get staff attendance
```

### HR Endpoints

```
GET    /api/v1/hr/employees            - List employees
GET    /api/v1/hr/employees/{id}       - Get employee
POST   /api/v1/hr/leave-requests       - Request leave
GET    /api/v1/hr/payroll              - Get payroll
```

---

## Role-Based Access Control

### Permission System

Each user role has specific permissions controlling what they can do:

#### Principal Permissions

✅ Full Academic Management
- View marks
- Approve marks
- Lock marks
- Create exams

✅ Full Financial Management
- View finance
- Approve principal-level requests

✅ Reporting & Analytics
- View all reports
- Access analytics dashboard

✅ School Operations
- View all operations
- Approve major decisions

#### Teacher Permissions

✅ Academic Operations
- View students
- Create marks
- Submit marks
- View class performance

✅ Class Management
- Manage assigned classes
- Track attendance
- Update grades

❌ Cannot
- Approve marks
- Manage finances
- Access admin functions

#### School Admin Permissions

✅ User Management
- Create users
- Manage roles
- Update permissions

✅ School Settings
- Configure school details
- Manage departments

✅ Reporting
- Generate reports
- Access data

❌ Cannot
- Approve academic decisions
- Manage multi-school operations

#### Platform Admin Permissions

✅ Complete System Access
- All school management
- Multi-school administration
- System configuration
- All permissions

---

## Testing Guide

### 1. User Authentication Testing

#### Test Case: Principal Login

```bash
# Step 1: Login as principal
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "principal",
    "password": "Principal@123"
  }'

# Expected: Get accessToken and refreshToken

# Step 2: Use token to access protected resource
TOKEN="<access_token_from_login>"
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"

# Expected: Get list of students
```

#### Test Case: Invalid Credentials

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "principal",
    "password": "WrongPassword"
  }'

# Expected: 401 Unauthorized
```

### 2. Student Management Testing

#### Get All Students

```bash
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" | jq .
```

#### Get Student Details

```bash
STUDENT_ID="470c21d5-52d3-4c2d-9c44-d5065d54242e"
curl http://localhost:3000/api/v1/students/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 3. Academic Testing

#### Get Exams

```bash
curl http://localhost:3000/api/v1/academics/exams \
  -H "Authorization: Bearer $TOKEN" | jq .
```

#### Get Student Marks

```bash
curl http://localhost:3000/api/v1/students/$STUDENT_ID/marks \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 4. Finance Testing

#### Get Invoices

```bash
curl http://localhost:3000/api/v1/finance/invoices \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, number, amount, balance}'
```

#### Get Payments

```bash
curl http://localhost:3000/api/v1/finance/payments \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, amount, method, status}'
```

### 5. Attendance Testing

#### Get Student Attendance

```bash
curl "http://localhost:3000/api/v1/attendance/student?studentId=$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 6. Role-Based Access Testing

#### Test Teacher Access

```bash
# Login as teacher
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "teacher1",
    "password": "Teacher@123"
  }'

# Use teacher token to access marks
TEACHER_TOKEN="<teacher_access_token>"
curl http://localhost:3000/api/v1/academics/marks \
  -H "Authorization: Bearer $TEACHER_TOKEN"
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot GET /api/v1/..." Error

**Problem:** Endpoint returns 404 Not Found

**Solution:**
- Verify the endpoint URL is correct
- Check the HTTP method (GET, POST, PUT, DELETE)
- Ensure you're using the correct base URL with `/api/v1`

#### 2. "401 Unauthorized" Error

**Problem:** Request returns 401

**Solution:**
- Check that you're including the Authorization header
- Verify the token format: `Authorization: Bearer <token>`
- Ensure the token hasn't expired (access tokens expire in 15 minutes)
- Use refresh token to get new access token

#### 3. "403 Forbidden" Error

**Problem:** Request returns 403 Forbidden

**Solution:**
- Your user role doesn't have required permissions
- Check the "Role-Based Access Control" section
- Use a user with higher permissions (e.g., Principal instead of Teacher)
- Verify the permission list in your JWT token

#### 4. Database Connection Error

**Problem:** Application won't start or database queries fail

**Solution:**
- Verify DATABASE_URL is correct in `.env`
- Check Neon database connection status
- Ensure SSL mode is enabled: `?sslmode=require`
- Verify database credentials are correct

#### 5. Token Expired

**Problem:** "Token expired" error after 15 minutes

**Solution:**
- Use refresh token to get new access token:
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

### System Health Checks

#### Check Application Status

```bash
curl http://localhost:3000/health
```

#### Verify Database Connection

```bash
# Login and get users
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

#### Check Token Validity

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## Advanced Usage

### Pagination

Most list endpoints support pagination:

```bash
curl "http://localhost:3000/api/v1/students?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Filtering

Filter results by specific criteria:

```bash
# Get students by status
curl "http://localhost:3000/api/v1/students?status=ACTIVE" \
  -H "Authorization: Bearer $TOKEN"

# Get attendance for date range
curl "http://localhost:3000/api/v1/attendance/student?from=2024-06-01&to=2024-06-18" \
  -H "Authorization: Bearer $TOKEN"
```

### Sorting

Sort results by field:

```bash
curl "http://localhost:3000/api/v1/students?sort=lastName&order=ASC" \
  -H "Authorization: Bearer $TOKEN"
```

### Batch Operations

Some endpoints support batch operations:

```bash
# Record multiple students' attendance
curl -X POST http://localhost:3000/api/v1/attendance/batch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "records": [
      {"studentId": "...", "status": "PRESENT"},
      {"studentId": "...", "status": "ABSENT"}
    ]
  }'
```

---

## Performance Tips

1. **Cache Frequently Accessed Data**
   - Student lists
   - Fee structures
   - Grade scales

2. **Use Pagination**
   - Always paginate large lists
   - Default limit: 10, max limit: 100

3. **Optimize Queries**
   - Use specific filters when possible
   - Avoid full dataset scans
   - Use date ranges for historical data

4. **Batch Operations**
   - Use batch endpoints when available
   - Reduces API calls significantly

---

## Security Best Practices

1. **Protect Tokens**
   - Never share access tokens
   - Store tokens securely
   - Don't log tokens

2. **Use HTTPS**
   - Always use HTTPS in production
   - Never send credentials over HTTP

3. **Rotate Credentials**
   - Change passwords regularly
   - Update API keys periodically

4. **Audit Logs**
   - Monitor system activity
   - Review access logs regularly

5. **Role Segregation**
   - Use least privilege principle
   - Assign minimal required permissions
   - Separate sensitive roles

---

## Support & Resources

### Documentation
- API Documentation: Available at `/api/docs` (Swagger UI)
- GitHub Repository: https://github.com/EMANUELKIRUI/backend-elimu

### Contact Support
- Email: support@africaschool.local
- Phone: +254-712-345-678

---

## Version Information

- **System Version:** 0.1.0
- **API Version:** v1
- **Last Updated:** June 18, 2026

---

**Happy Learning! 🎓**
