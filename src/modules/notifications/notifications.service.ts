import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: AuthUser) {
    const where = user.schoolId ? { schoolId: user.schoolId } : {};
    return this.prisma.pushNotification.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  send(user: AuthUser, dto: CreateNotificationDto) {
    const schoolId = user.schoolId;
    if (!schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return this.prisma.pushNotification.create({
      data: {
        schoolId,
        userId: dto.userId,
        title: dto.title,
        body: dto.body,
        data: dto.data,
        status: dto.status ?? 'QUEUED',
      },
    });
  }
}
