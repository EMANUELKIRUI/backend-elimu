import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcademicsModule } from './modules/academics/academics.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { FinanceModule } from './modules/finance/finance.module';
import { HealthModule } from './modules/health/health.module';
import { PlatformModule } from './modules/platform/platform.module';
import { PrismaModule } from './modules/prisma/prisma.module';
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
    PlatformModule,
    SchoolsModule,
    StudentsModule,
    AcademicsModule,
    FinanceModule,
    CommunicationModule,
    HealthModule,
  ],
})
export class AppModule {}
