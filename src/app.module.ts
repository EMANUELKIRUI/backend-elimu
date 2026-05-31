import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
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
})
export class AppModule {}
