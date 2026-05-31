# AfricaSchool / Elimu ERP Backend

AfricaSchool, also called Elimu in this repository, is a multi-school subscription ERP platform for African schools. It is designed to support full school operations, not only academics. Each school subscribes to the platform, receives its own private workspace, and enables the modules it needs.

Parents do not log in to the system. They receive school communication through SMS and Gmail/email only.

## 1. Platform Goal

The backend should support:

- Multi-school subscription management
- Role-based dashboards and permissions
- Department-based access control
- Kenya CBC curriculum
- Kenya 8-4-4 curriculum
- Generic marks-based curriculum
- Generic competency-based curriculum
- Excel-like marks entry
- Automatic grading and report generation
- Full ERP operations: finance, HR, boarding, transport, inventory, procurement, library, health, discipline, events, and reports

## 2. Platform-Level Administration

### Platform Admin

The Platform Admin manages the AfricaSchool platform itself.

Functions:

- Register subscribed schools
- Activate, renew, suspend, or expire school subscriptions
- Manage subscription packages
- Monitor platform usage
- Manage platform users and support accounts
- Manage platform-wide settings, backups, and updates

Permissions:

- Can manage schools and subscriptions
- Can manage package limits and billing status
- Can view platform-level reports
- Should not edit daily school records unless support access is granted

## 3. School Subscription Model

Schools subscribe to use the platform. The subscription package controls which modules are available.

Example packages:

| Package | Included Scope |
| --- | --- |
| Basic | Students, attendance, fees, marks |
| Standard | Academics, finance, SMS/email, report cards |
| Professional | HR, library, inventory, transport |
| Enterprise | Full ERP, boarding, procurement, analytics, multi-branch |

Main subscribing users:

- School Admin
- Principal
- Bursar

## 4. Role-Based Display Rule

Every user must see a dashboard based on:

- School
- Subscription package
- Enabled modules
- Role
- Department
- Permissions
- Approval limits

Important rule:

If a user has no permission for a module, that module must not appear in their menu, and the backend must also block direct API access.

Examples:

| Role | Dashboard |
| --- | --- |
| Boarding HOD | Boarding activities only |
| Transport HOD | Transport activities only |
| Bursar | Finance only |
| Teacher | Assigned classes and subjects |
| Deputy Principal Academics | Academics, exams, marks, report approvals |
| Deputy Principal Administration | Discipline, boarding, transport, inventory, operations |
| Principal | Whole-school leadership and approvals |
| Board Chairperson | Monitoring and governance reports |
| School Admin | School configuration and users |
| Platform Admin | Schools, subscriptions, packages |

## 5. School-Level Roles

### School Admin

The School Admin controls the system setup for one school.

Functions:

- Manage school profile
- Create users
- Assign roles and permissions
- Enable or disable modules
- Configure departments
- Configure academic years and terms
- Configure curriculum, classes, streams, subjects, and grading
- Configure fee structures
- Configure approval limits
- View school audit logs

Permissions:

- Full configuration access inside one school
- Cannot manage other schools unless also Platform Admin

### Board Chairman / Chairlady

The Board Chairperson has governance and monitoring access.

Functions:

- View finance summaries
- View academic summaries
- Monitor discipline, attendance, procurement, and departments
- Review principal approval history
- Monitor school performance

Permissions:

- Mostly view-only
- Can comment or request clarification if enabled
- Should not edit daily records

### Principal

The Principal is the head of school operations.

Functions:

- Monitor all departments
- Approve major finance requests
- Approve procurement
- Approve official communication
- Review academic and finance reports
- Monitor staff and students
- Give final approval to report cards if required

Permissions:

- Broad school-level access
- Final approval authority for major school decisions
- No platform subscription control

### Deputy Principal Administration

The Deputy Principal Administration manages daily administration and operations.

Functions:

- Supervise non-academic departments
- Monitor discipline, boarding, transport, inventory, and staff attendance
- Review operational requests
- Approve selected finance requests within configured limits
- Escalate major matters to the Principal

Permissions:

- Admin and operations access
- Limited finance approval based on amount
- No final academic result approval unless granted

### Deputy Principal Academics

The Deputy Principal Academics controls academic operations.

Functions:

- Manage academic calendar
- Manage exams and assessments
- Monitor lesson plans and syllabus coverage
- Review marks and CBC competency assessments
- Approve HOD-submitted results
- Return results for correction
- Approve academic report cards

Permissions:

- Full academic control
- Can approve academic results
- Cannot manage general finance unless granted

### Bursar

The Bursar manages school finance.

Functions:

- Create fee structures
- Generate invoices
- Record payments
- Issue receipts
- Track balances
- Send fee reminders by SMS/email
- Record expenses
- Prepare payment requests
- Prepare finance reports
- Manage payroll finance if enabled

Permissions:

- Finance operation access
- Can prepare payments and reports
- Cannot approve high-value payments alone
- Cannot change approval rules unless granted

### HOD

Each department can have a Head of Department.

Examples:

- Boarding HOD
- Transport HOD
- Science HOD
- Mathematics HOD
- Discipline HOD
- Guidance and Counseling HOD
- ICT HOD
- Games/Sports HOD

Functions:

- Manage department activities
- Monitor department staff
- Review department records
- Request department resources
- Generate department reports
- Approve department work before higher approval

Permissions:

- Limited to assigned department
- Cannot access unrelated departments unless permission is granted

### Teacher

Teachers manage assigned academic work.

Functions:

- View assigned classes and subjects
- Mark attendance
- Enter marks
- Enter CBC competency records
- Create lesson plans
- Record syllabus coverage
- Add assignments and comments
- Submit marks to HOD

Permissions:

- Assigned classes and subjects only
- Cannot access finance
- Cannot approve final results
- Cannot edit locked marks

## 6. Core ERP Modules

### School Setup Module

Stores school identity, branches, academic year, term structure, active modules, departments, users, roles, and permissions.

### Curriculum Engine

Allows each school to choose and configure its education system.

Initial profiles:

- Kenya CBC
- Kenya 8-4-4
- Generic marks-based curriculum
- Generic competency-based curriculum

Functions:

- Define levels, grades, classes, and streams
- Define subjects or learning areas
- Define strands and sub-strands for CBC
- Define assessment methods
- Define grading rules
- Define report templates
- Define promotion rules

### Excel-Like Marks Entry

Provides spreadsheet-style marks entry.

Functions:

- Editable mark sheets
- Copy and paste from Excel
- Auto-save drafts
- Validate marks
- Calculate total, average, grade, and position
- Submit marks for approval
- Lock marks after approval
- Export marks to Excel or PDF

Approval flow:

1. Teacher enters marks.
2. Teacher submits to HOD.
3. HOD reviews department marks.
4. Deputy Principal Academics approves.
5. Principal final-approves if required.
6. Report cards are generated.

### CBC Competency Assessment

Supports competency-based learning.

Functions:

- Record learning areas
- Record strands and sub-strands
- Record competency levels
- Attach evidence
- Add teacher observations
- Generate CBC progress reports

Example levels:

- EE: Exceeding Expectations
- ME: Meeting Expectations
- AE: Approaching Expectations
- BE: Below Expectations

### Report Cards

Generates academic reports.

Functions:

- Marks-based report cards
- CBC progress reports
- Competency reports
- Attendance summaries
- Teacher, HOD, deputy, and principal comments
- PDF generation
- Gmail/email delivery to parents

### Student Management

Manages the student lifecycle.

Functions:

- Admission
- Student profiles
- Guardian contacts
- Class placement
- Documents
- Medical notes
- Transfers
- Graduation
- Alumni records

### Attendance

Tracks student and staff attendance.

Functions:

- Daily class attendance
- Boarding attendance
- Staff attendance
- Late arrivals
- Absence reasons
- SMS alerts to parents
- Attendance reports

### Finance

Manages fees and money flow.

Functions:

- Fee structures
- Invoices
- Payments
- Receipts
- Balances
- Discounts, bursaries, scholarships
- Expenses
- Refunds
- Payroll finance
- Financial reports

Finance approval flow:

1. Bursar prepares request.
2. Deputy Principal Administration approves if within limit.
3. Principal approves high-value requests.
4. Board Chairperson monitors finance reports.

### Communication

Sends messages to parents, guardians, staff, and students.

Channels:

- SMS
- Gmail/email

Message types:

- Fee reminders
- Attendance alerts
- Discipline alerts
- Emergency messages
- Report card emails
- School notices
- Exam notices
- Meeting reminders

### HR and Staff

Manages school employees.

Functions:

- Staff profiles
- Departments
- Contracts
- Staff attendance
- Leave requests
- Appraisals
- Payroll records
- Staff documents

### Procurement

Manages purchasing.

Functions:

- Purchase requests
- Supplier records
- Quotations
- Purchase orders
- Goods received notes
- Supplier invoices
- Approval workflow

### Inventory and Assets

Tracks stock and school property.

Functions:

- Asset register
- Stationery
- Uniforms
- Lab equipment
- Furniture
- Computers
- Stock in/out
- Asset assignment
- Maintenance records

### Library

Manages books and borrowing.

Functions:

- Book catalog
- Borrowing and returns
- Overdue tracking
- Fines
- Library reports

### Boarding

Manages boarding activities.

Functions:

- Dormitories
- Rooms and beds
- Student allocation
- Boarding attendance
- Leave-out requests
- Boarding incidents
- Boarding supplies
- Boarding reports

### Transport

Manages school transport.

Functions:

- Vehicles
- Routes
- Drivers
- Pickup and drop-off points
- Student assignments
- Fuel records
- Maintenance
- Transport fees
- Transport reports

### Discipline and Guidance

Manages behavior and counseling.

Functions:

- Incident reports
- Warnings
- Suspensions
- Rewards
- Counseling notes
- Parent SMS/email alerts
- Discipline reports

### Health and Clinic

Manages health records.

Functions:

- Medical records
- Allergies
- Clinic visits
- Medication records
- Incident reports
- Emergency contacts
- Parent alerts

### Events and Activities

Manages the school calendar and activities.

Functions:

- School calendar
- Exams calendar
- Sports
- Clubs
- Trips
- Assemblies
- Parent meetings
- Permission slips
- Event attendance

### Government and Compliance Reports

Supports country and curriculum reporting.

Functions:

- Enrollment reports
- Attendance reports
- Academic reports
- Staff reports
- Finance reports
- School census reports
- Curriculum-specific reports

### Audit Logs and Security

Tracks important actions.

Audit examples:

- Logins
- Marks changes
- Finance approvals
- Deleted records
- User changes
- Permission changes
- Sent messages
- Report generation
- Subscription changes

## 7. Permission Model

Use role-based access control with department scope.

Permission actions:

- View
- Create
- Edit
- Delete
- Approve
- Reject
- Export
- Lock
- Unlock
- Send message

Backend rule:

All API endpoints must check permissions. The frontend dashboard should hide inaccessible modules, but the backend remains the final security layer.

## 8. Recommended Backend Entities

Core platform:

- schools
- subscriptions
- subscription_plans
- modules
- school_modules
- users
- roles
- permissions
- role_permissions
- departments
- department_members
- audit_logs

Academics:

- curriculum_profiles
- education_systems
- academic_years
- terms
- school_levels
- grade_levels
- classes
- streams
- subjects
- learning_areas
- strands
- sub_strands
- exams
- assessment_types
- marks
- competency_assessments
- grading_scales
- grading_rules
- report_cards

Finance:

- fee_structures
- invoices
- payments
- receipts
- expenses
- finance_requests
- approval_workflows
- approval_steps
- suppliers
- payroll_records

Operations:

- students
- guardians
- staff
- attendance_records
- library_books
- library_loans
- inventory_items
- assets
- purchase_requests
- transport_routes
- vehicles
- dormitories
- boarding_allocations
- discipline_cases
- clinic_visits
- events
- messages

## 9. Build Phases

### Phase 1: Foundation

- Multi-school setup
- Subscriptions
- Users
- Roles
- Permissions
- School setup
- Module enable/disable

### Phase 2: Academics

- Curriculum engine
- CBC
- 8-4-4
- Generic marks curriculum
- Generic competency curriculum
- Classes, subjects, exams, marks
- Academic approvals

### Phase 3: Finance

- Fees
- Invoices
- Payments
- Receipts
- Expenses
- Finance approvals
- Finance reports

### Phase 4: Communication

- SMS integration
- Gmail/email integration
- Fee reminders
- Attendance alerts
- Report card delivery

### Phase 5: ERP Operations

- HR
- Inventory
- Procurement
- Library
- Boarding
- Transport
- Health
- Discipline
- Events

### Phase 6: Reports and Analytics

- Academic reports
- Finance reports
- Department reports
- Board dashboard
- Government reports
- Audit logs

## 10. Final Principle

AfricaSchool should be built as a modular, role-based, subscription ERP platform.

Each school subscribes, enables its modules, creates users, assigns roles, and every user sees only the dashboard and activities they are allowed to access.
