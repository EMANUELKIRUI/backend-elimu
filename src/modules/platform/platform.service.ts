import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePackageDto } from './dto/create-package.dto';

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  findPackages() {
    return this.prisma.subscriptionPackage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  createPackage(dto: CreatePackageDto) {
    return this.prisma.subscriptionPackage.create({
      data: {
        name: dto.name,
        description: dto.description,
        monthlyFee: dto.monthlyFee,
        modules: dto.modules,
      },
    });
  }

  findSchools() {
    return this.prisma.school.findMany({
      include: { subscriptions: { include: { package: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
