import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Permissions('notifications.view')
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  getAll(@CurrentUser() user: AuthUser) {
    return this.notificationsService.findAll(user);
  }

  @Post()
  @Permissions('notifications.send')
  @ApiOperation({ summary: 'Send a new notification' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  send(@CurrentUser() user: AuthUser, @Body() dto: CreateNotificationDto) {
    return this.notificationsService.send(user, dto);
  }
}
