import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AcademicsModule } from './modules/academics/academics.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { EnterpriseModule } from './modules/enterprise/enterprise.module';
import { FinanceModule } from './modules/finance/finance.module';
import { HealthModule } from './modules/health/health.module';
import { IdentityModule } from './modules/identity/identity.module';
import { OperationsModule } from './modules/operations/operations.module';
import { PanAfricaModule } from './modules/pan-africa/pan-africa.module';
import { PlatformModule } from './modules/platform/platform.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { StudentsModule } from './modules/students/students.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuditModule } from './modules/audit/audit.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { SearchModule } from './modules/search/search.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    AuthModule,
    IdentityModule,
    PlatformModule,
    TenantsModule,
    OrganizationsModule,
    SubscriptionsModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuditModule,
    DocumentsModule,
    IntegrationsModule,
    SearchModule,
    NotificationsModule,
    WorkflowsModule,
    AnalyticsModule,
    DashboardModule,
    SchoolsModule,
    StudentsModule,
    AcademicsModule,
    AttendanceModule,
    FinanceModule,
    CommunicationModule,
    ReportsModule,
    EnterpriseModule,
    OperationsModule,
    PanAfricaModule,
    HealthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
