import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tenant: true, parent: true, children: true },
    });
  }

  findOne(id: string) {
    return this.prisma.organization.findUniqueOrThrow({
      where: { id },
      include: { tenant: true, parent: true, children: true },
    });
  }

  async create(dto: CreateOrganizationDto) {
    await this.prisma.tenant.findUniqueOrThrow({ where: { id: dto.tenantId } });

    if (dto.parentId) {
      const parent = await this.prisma.organization.findUniqueOrThrow({
        where: { id: dto.parentId },
        include: { tenant: true },
      });

      if (parent.tenantId !== dto.tenantId) {
        throw new BadRequestException('Parent organization must belong to the same tenant');
      }
    }

    return this.prisma.organization.create({ data: dto });
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    if (dto.parentId) {
      const parent = await this.prisma.organization.findUniqueOrThrow({
        where: { id: dto.parentId },
      });

      if (dto.tenantId && parent.tenantId !== dto.tenantId) {
        throw new BadRequestException('Parent organization must belong to the same tenant');
      }
    }

    return this.prisma.organization.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.organization.delete({ where: { id } });
  }
}
