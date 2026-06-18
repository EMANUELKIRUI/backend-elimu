import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: AuthUser) {
    const where = user.schoolId ? { schoolId: user.schoolId } : {};
    return this.prisma.integrationEndpoint.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  create(user: AuthUser, dto: CreateIntegrationDto) {
    const schoolId = dto.schoolId ?? user.schoolId;
    if (!schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return this.prisma.integrationEndpoint.create({
      data: {
        schoolId,
        country: dto.country,
        provider: dto.provider,
        type: dto.type,
        baseUrl: dto.baseUrl,
        config: dto.config,
        enabled: dto.enabled ?? true,
      },
    });
  }

  async update(user: AuthUser, id: string, dto: UpdateIntegrationDto) {
    const existing = await this.prisma.integrationEndpoint.findUniqueOrThrow({ where: { id } });
    if (user.schoolId && existing.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot update integrations outside your school');
    }

    return this.prisma.integrationEndpoint.update({
      where: { id },
      data: {
        country: dto.country,
        provider: dto.provider,
        type: dto.type,
        baseUrl: dto.baseUrl,
        config: dto.config,
        enabled: dto.enabled,
      },
    });
  }

  async remove(user: AuthUser, id: string) {
    const existing = await this.prisma.integrationEndpoint.findUniqueOrThrow({ where: { id } });
    if (user.schoolId && existing.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot delete integrations outside your school');
    }

    return this.prisma.integrationEndpoint.delete({ where: { id } });
  }
}
