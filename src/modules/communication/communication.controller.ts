import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { CommunicationService } from './communication.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post('messages')
  @Permissions('communication.send')
  sendMessage(@CurrentUser() user: AuthUser, @Body() dto: SendMessageDto) {
    return this.communicationService.enqueueMessage(user, dto);
  }
}
