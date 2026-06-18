import { Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  widgets(user: AuthUser) {
    const where = user.schoolId ? { schoolId: user.schoolId } : {};
    return this.prisma.analyticsDashboard.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });
  }
}
