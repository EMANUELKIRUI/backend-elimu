import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('academic-summary')
  @Permissions('reports.view')
  academicSummary(@CurrentUser() user: AuthUser) {
    return this.reportsService.academicSummary(user);
  }

  @Get('attendance-summary')
  @Permissions('reports.view')
  attendanceSummary(@CurrentUser() user: AuthUser) {
    return this.reportsService.attendanceSummary(user);
  }

  @Get('finance-summary')
  @Permissions('reports.view')
  financeSummary(@CurrentUser() user: AuthUser) {
    return this.reportsService.financeSummary(user);
  }
}
