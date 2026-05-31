import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { AuthUser } from '../../common/types/auth-user';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class CommunicationService {
  private readonly smsQueue: Queue;
  private readonly emailQueue: Queue;

  constructor(private readonly config: ConfigService) {
    const connection = { url: this.config.get<string>('REDIS_URL') };
    this.smsQueue = new Queue('sms_queue', { connection });
    this.emailQueue = new Queue('email_queue', { connection });
  }

  async enqueueMessage(user: AuthUser, dto: SendMessageDto) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    const queue = dto.channel === 'sms' ? this.smsQueue : this.emailQueue;
    const job = await queue.add(`${dto.channel}.message`, {
      schoolId: user.schoolId,
      createdById: user.id,
      ...dto,
    });

    return {
      queued: true,
      channel: dto.channel,
      jobId: job.id,
    };
  }
}
