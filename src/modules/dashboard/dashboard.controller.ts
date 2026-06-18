import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @Permissions('dashboard.view')
  @ApiOperation({ summary: 'Get dashboard widgets' })
  @ApiResponse({ status: 200, description: 'Dashboard widgets retrieved successfully' })
  getWidgets(@CurrentUser() user: AuthUser) {
    return this.dashboardService.widgets(user);
  }
}
