import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: AuthUser) {
    const where = user.schoolId
      ? { OR: [{ schoolId: user.schoolId }, { systemRole: true }] }
      : undefined;

    return this.prisma.role.findMany({
      where,
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: 'asc' },
    });
  }

  create(user: AuthUser, dto: CreateRoleDto) {
    const schoolId = dto.schoolId ?? user.schoolId;
    return this.prisma.role.create({
      data: {
        schoolId,
        name: dto.name,
        description: dto.description,
        systemRole: dto.systemRole ?? false,
        permissions: dto.permissionIds
          ? {
              create: dto.permissionIds.map((permissionId) => ({
                permission: { connect: { id: permissionId } },
              })),
            }
          : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async update(user: AuthUser, id: string, dto: UpdateRoleDto) {
    const existing = await this.prisma.role.findUniqueOrThrow({ where: { id } });
    if (user.schoolId && existing.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot update roles outside your school');
    }

    return this.prisma.$transaction(async (tx) => {
      const data: any = {
        description: dto.description,
        systemRole: dto.systemRole,
      };

      if (dto.permissionIds) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        data.permissions = {
          create: dto.permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        };
      }

      return tx.role.update({
        where: { id },
        data,
        include: { permissions: { include: { permission: true } } },
      });
    });
  }

  async remove(user: AuthUser, id: string) {
    const existing = await this.prisma.role.findUniqueOrThrow({ where: { id } });
    if (user.schoolId && existing.schoolId !== user.schoolId) {
      throw new ForbiddenException('Cannot delete roles outside your school');
    }

    await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    return this.prisma.role.delete({ where: { id } });
  }
}
