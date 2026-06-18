# 🧪 Elimu ERP - API Testing Guide

## Setup

### 1. Start the Backend
```bash
cd /workspaces/backend-elimu
npm run start:dev
```

### 2. Get an Access Token
```bash
# Save this in a variable for use in subsequent requests
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "principal",
    "password": "Principal@123"
  }' | jq -r '.accessToken')

echo "Token: $TOKEN"
```

### 3. Store School ID
```bash
SCHOOL_ID="f0309353-a58e-4605-999e-5a80ebcd7458"
```

---

## Test Cases

### 1. Health & Status Check

**Test:** Verify backend is running

```bash
curl -i http://localhost:3000/health
```

**Expected Response:** 200 OK with status "ok"

---

### 2. Authentication Tests

#### Test 2.1: Valid Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "principal",
    "password": "Principal@123"
  }' | jq .
```

**Expected:** Returns accessToken, refreshToken, and user details

#### Test 2.2: Invalid Password
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "principal",
    "password": "WrongPassword"
  }' | jq .
```

**Expected:** 401 Unauthorized

#### Test 2.3: Non-existent User
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "nonexistent",
    "password": "AnyPassword"
  }' | jq .
```

**Expected:** 401 Unauthorized

#### Test 2.4: Refresh Token
```bash
REFRESH_TOKEN="<your_refresh_token_from_login>"
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }" | jq .
```

**Expected:** Returns new accessToken

---

### 3. Student Management Tests

#### Test 3.1: Get All Students
```bash
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, firstName, lastName, admissionNumber, status}'
```

**Expected:** List of 5 students

#### Test 3.2: Get Specific Student
```bash
STUDENT_ID="470c21d5-52d3-4c2d-9c44-d5065d54242e"
curl http://localhost:3000/api/v1/students/$STUDENT_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** Student details including class, stream, guardian info

#### Test 3.3: Get Student Guardians
```bash
curl http://localhost:3000/api/v1/students/$STUDENT_ID/guardians \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** List of guardians for the student

#### Test 3.4: Get Student Marks
```bash
curl http://localhost:3000/api/v1/students/$STUDENT_ID/marks \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {subject, score, grade, status}'
```

**Expected:** All marks for the student across subjects

#### Test 3.5: Get Student Attendance
```bash
curl "http://localhost:3000/api/v1/attendance/student?studentId=$STUDENT_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {date, status, notes}'
```

**Expected:** Attendance records for the student

#### Test 3.6: Get Non-existent Student
```bash
curl http://localhost:3000/api/v1/students/nonexistent-id \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** 404 Not Found

---

### 4. Academic Management Tests

#### Test 4.1: Get All Exams
```bash
curl http://localhost:3000/api/v1/academics/exams \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, name, academicYear, status}'
```

**Expected:** List of exams (should have at least 1)

#### Test 4.2: Get Exam Details
```bash
EXAM_ID=$(curl -s http://localhost:3000/api/v1/academics/exams \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')
  
curl http://localhost:3000/api/v1/academics/exams/$EXAM_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** Exam with subjects and schedules

#### Test 4.3: Get All Marks
```bash
curl http://localhost:3000/api/v1/academics/marks \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, studentId, subjectId, score, grade, status}' | head -30
```

**Expected:** List of marks (15 total for 5 students × 3 subjects)

#### Test 4.4: Get Classes
```bash
curl http://localhost:3000/api/v1/schools/$SCHOOL_ID/classes \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, name, level}'
```

**Expected:** List of 2 classes (Form 1, Form 2)

#### Test 4.5: Get Subjects
```bash
curl http://localhost:3000/api/v1/schools/$SCHOOL_ID/subjects \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, name, code, mode, maxMarks}'
```

**Expected:** List of 3 subjects (Math, English, Science)

---

### 5. Finance Tests

#### Test 5.1: Get All Invoices
```bash
curl http://localhost:3000/api/v1/finance/invoices \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, number, amount, balance, dueDate, status}'
```

**Expected:** List of 5 invoices (one per student)

#### Test 5.2: Get Specific Invoice
```bash
INVOICE_ID=$(curl -s http://localhost:3000/api/v1/finance/invoices \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')

curl http://localhost:3000/api/v1/finance/invoices/$INVOICE_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** Invoice with items breakdown

#### Test 5.3: Get Invoice Items
```bash
curl http://localhost:3000/api/v1/finance/invoices/$INVOICE_ID/items \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {description, amount}'
```

**Expected:** 4 items (Tuition, Boarding, Lunch, Sports)

#### Test 5.4: Get All Payments
```bash
curl http://localhost:3000/api/v1/finance/payments \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, amount, method, reference, status}'
```

**Expected:** List of 5 payments

#### Test 5.5: Get All Receipts
```bash
curl http://localhost:3000/api/v1/finance/receipts \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, number, amount, issuedAt}'
```

**Expected:** List of 5 receipts

#### Test 5.6: Get Fee Structure
```bash
curl http://localhost:3000/api/v1/finance/fee-structures \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** Fee structure with items

---

### 6. Attendance Tests

#### Test 6.1: Record Student Attendance
```bash
curl -X POST http://localhost:3000/api/v1/attendance/student \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"studentId\": \"$STUDENT_ID\",
    \"date\": \"2024-06-19\",
    \"status\": \"PRESENT\",
    \"notes\": \"Test attendance record\"
  }" | jq .
```

**Expected:** Created attendance record or conflict if already exists

#### Test 6.2: Get Student Attendance
```bash
curl "http://localhost:3000/api/v1/attendance/student?studentId=$STUDENT_ID&from=2024-06-01&to=2024-06-30" \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {date, status, notes}'
```

**Expected:** List of attendance records

#### Test 6.3: Get Attendance Statistics
```bash
curl "http://localhost:3000/api/v1/attendance/statistics?from=2024-06-01&to=2024-06-30" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** Attendance statistics and summary

---

### 7. HR Tests

#### Test 7.1: Get All Employees
```bash
curl http://localhost:3000/api/v1/hr/employees \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | {id, firstName, lastName, jobTitle, department}'
```

**Expected:** List of 2 employees (Principal, Teacher)

#### Test 7.2: Get Specific Employee
```bash
EMPLOYEE_ID=$(curl -s http://localhost:3000/api/v1/hr/employees \
  -H "Authorization: Bearer $TOKEN" | jq -r '.[0].id')

curl http://localhost:3000/api/v1/hr/employees/$EMPLOYEE_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** Employee details with contracts and assignments

#### Test 7.3: Get Employee Payroll
```bash
curl http://localhost:3000/api/v1/hr/payroll?employeeId=$EMPLOYEE_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected:** Payroll records for employee

---

### 8. Authorization Tests

#### Test 8.1: Teacher Access Control
```bash
# Login as teacher
TEACHER_TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "teacher1",
    "password": "Teacher@123"
  }' | jq -r '.accessToken')

# Try to access students (should work)
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TEACHER_TOKEN" | jq '.[] | {firstName, lastName}' | head -5
```

**Expected:** Access granted to students

#### Test 8.2: Missing Authorization Header
```bash
curl http://localhost:3000/api/v1/students | jq .
```

**Expected:** 401 Unauthorized or redirected to login

#### Test 8.3: Invalid Token
```bash
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer invalid-token-12345" | jq .
```

**Expected:** 401 Unauthorized

---

### 9. Error Handling Tests

#### Test 9.1: Malformed Request Body
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{invalid json}' | jq .
```

**Expected:** 400 Bad Request

#### Test 9.2: Missing Required Field
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "principal"}' | jq .
```

**Expected:** 400 Bad Request (missing password)

#### Test 9.3: Invalid Content-Type
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: text/plain" \
  -d 'identifier=principal&password=Principal@123' | jq .
```

**Expected:** 400 Bad Request or error

---

### 10. Performance Tests

#### Test 10.1: List with Pagination
```bash
curl "http://localhost:3000/api/v1/students?page=1&limit=2" \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'
```

**Expected:** Returns max 2 items

#### Test 10.2: Filter Students by Status
```bash
curl "http://localhost:3000/api/v1/students?status=ACTIVE" \
  -H "Authorization: Bearer $TOKEN" | jq 'length'
```

**Expected:** All 5 students (all are ACTIVE)

#### Test 10.3: Sorted Results
```bash
curl "http://localhost:3000/api/v1/students?sort=lastName&order=ASC" \
  -H "Authorization: Bearer $TOKEN" | jq '.[] | .lastName'
```

**Expected:** Students sorted by last name

---

## Test Summary Script

```bash
#!/bin/bash

echo "🧪 Elimu ERP API Test Suite"
echo "============================"

# 1. Health Check
echo "1. Testing health endpoint..."
curl -s http://localhost:3000/health | jq '.status'

# 2. Login
echo "2. Testing authentication..."
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "principal",
    "password": "Principal@123"
  }' | jq -r '.accessToken')
echo "✅ Login successful (token: ${TOKEN:0:20}...)"

# 3. Students
echo "3. Testing student endpoints..."
STUDENT_COUNT=$(curl -s http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ Found $STUDENT_COUNT students"

# 4. Academics
echo "4. Testing academic endpoints..."
EXAM_COUNT=$(curl -s http://localhost:3000/api/v1/academics/exams \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ Found $EXAM_COUNT exams"

# 5. Finance
echo "5. Testing finance endpoints..."
INVOICE_COUNT=$(curl -s http://localhost:3000/api/v1/finance/invoices \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ Found $INVOICE_COUNT invoices"

# 6. Attendance
echo "6. Testing attendance endpoints..."
ATTENDANCE_COUNT=$(curl -s "http://localhost:3000/api/v1/attendance/student" \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ Attendance endpoint working"

# 7. HR
echo "7. Testing HR endpoints..."
EMPLOYEE_COUNT=$(curl -s http://localhost:3000/api/v1/hr/employees \
  -H "Authorization: Bearer $TOKEN" | jq 'length')
echo "✅ Found $EMPLOYEE_COUNT employees"

echo ""
echo "✅ All tests passed! System is operational."
```

---

## Expected Results

| Test | Expected Status |
|------|-----------------|
| Health Check | 200 OK |
| Valid Login | 200 OK + tokens |
| Invalid Login | 401 Unauthorized |
| Get Students | 200 OK (5 students) |
| Get Exams | 200 OK (1 exam) |
| Get Marks | 200 OK (15 marks) |
| Get Invoices | 200 OK (5 invoices) |
| Get Payments | 200 OK (5 payments) |
| Get Employees | 200 OK (2 employees) |
| No Auth Header | 401 Unauthorized |

---

For more details, see the main [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md)
