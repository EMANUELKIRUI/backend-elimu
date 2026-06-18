import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: AuthUser) {
    const where = user.schoolId ? { schoolId: user.schoolId } : {};
    return this.prisma.workflow.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  create(user: AuthUser, dto: CreateWorkflowDto) {
    const schoolId = dto.schoolId ?? user.schoolId;
    if (user.schoolId && schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot create workflow outside your school');
    }

    return this.prisma.workflow.create({
      data: {
        schoolId,
        name: dto.name,
        description: dto.description,
        targetModule: dto.targetModule,
        status: dto.status ?? 'ACTIVE',
        steps: dto.steps ?? [],
      },
    });
  }

  async update(user: AuthUser, id: string, dto: UpdateWorkflowDto) {
    const existing = await this.prisma.workflow.findUniqueOrThrow({ where: { id } });
    if (user.schoolId && existing.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot update workflow outside your school');
    }

    return this.prisma.workflow.update({
      where: { id },
      data: {
        description: dto.description,
        status: dto.status,
        steps: dto.steps,
      },
    });
  }

  async remove(user: AuthUser, id: string) {
    const existing = await this.prisma.workflow.findUniqueOrThrow({ where: { id } });
    if (user.schoolId && existing.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot delete workflow outside your school');
    }

    return this.prisma.workflow.delete({ where: { id } });
  }
}
