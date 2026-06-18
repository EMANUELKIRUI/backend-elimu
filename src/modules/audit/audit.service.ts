import { Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: AuthUser) {
    const where = user.schoolId ? { schoolId: user.schoolId } : {};

    return this.prisma.auditLog.findMany({
      where,
      include: { user: true, school: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
