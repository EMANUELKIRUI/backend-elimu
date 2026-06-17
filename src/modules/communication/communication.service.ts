import { ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { AuthUser } from '../../common/types/auth-user';
import { SendMessageDto } from './dto/send-message.dto';

type UpstashJob = {
  schoolId: string;
  createdById: string;
} & SendMessageDto;

@Injectable()
export class CommunicationService {
  private readonly smsQueue?: Queue;
  private readonly emailQueue?: Queue;
  private readonly upstashUrl?: string;
  private readonly upstashToken?: string;

  constructor(private readonly config: ConfigService) {
    if (this.config.get<string>('DISABLE_QUEUES') === 'true') {
      return;
    }

    const redisUrl = this.config.get<string>('REDIS_URL');
    if (redisUrl) {
      const connection = { url: redisUrl };
      this.smsQueue = new Queue('sms_queue', { connection });
      this.emailQueue = new Queue('email_queue', { connection });
      return;
    }

    this.upstashUrl = this.config.get<string>('UPSTASH_REDIS_REST_URL');
    this.upstashToken = this.config.get<string>('UPSTASH_REDIS_REST_TOKEN');
  }

  async enqueueMessage(user: AuthUser, dto: SendMessageDto) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    const queue = dto.channel === 'sms' ? this.smsQueue : this.emailQueue;
    const payload = {
      schoolId: user.schoolId,
      createdById: user.id,
      ...dto,
    };

    if (!queue) {
      if (this.upstashUrl && this.upstashToken) {
        return this.enqueueWithUpstash(dto.channel, payload);
      }

      throw new ServiceUnavailableException('Messaging queue is not configured');
    }

    const job = await queue.add(`${dto.channel}.message`, payload);

    return {
      queued: true,
      channel: dto.channel,
      provider: 'bullmq',
      jobId: job.id,
    };
  }

  private async enqueueWithUpstash(channel: SendMessageDto['channel'], payload: UpstashJob) {
    if (!this.upstashUrl || !this.upstashToken) {
      throw new ServiceUnavailableException('Upstash queue is not configured');
    }

    const upstashUrl = this.upstashUrl;
    const upstashToken = this.upstashToken;
    const queueName = channel === 'sms' ? 'sms_queue' : 'email_queue';
    const response = await fetch(upstashUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${upstashToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['LPUSH', queueName, JSON.stringify(payload)]),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException('Upstash queue is not available');
    }

    const result = (await response.json()) as { result?: number };

    return {
      queued: true,
      channel,
      provider: 'upstash-rest',
      queue: queueName,
      depth: result.result,
    };
  }
}
