import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.schoolSubscription.findMany({
      include: { package: true, school: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateSubscriptionDto) {
    return this.prisma.schoolSubscription.create({
      data: {
        schoolId: dto.schoolId,
        packageId: dto.packageId,
        status: dto.status,
        startsAt: new Date(dto.startsAt),
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
      include: { package: true, school: true },
    });
  }

  update(id: string, dto: UpdateSubscriptionDto) {
    return this.prisma.schoolSubscription.update({
      where: { id },
      data: {
        packageId: dto.packageId,
        status: dto.status,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      },
      include: { package: true, school: true },
    });
  }

  remove(id: string) {
    return this.prisma.schoolSubscription.delete({ where: { id } });
  }
}
