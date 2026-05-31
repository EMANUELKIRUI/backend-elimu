import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { hash } from '@node-rs/argon2';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}

  findUsers(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    return this.prisma.user.findMany({
      where: { schoolId },
      include: { roles: { include: { role: true } }, departments: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  async createUser(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    if (!body.password) {
      throw new BadRequestException('Password is required');
    }

    return this.prisma.user.create({
      data: {
        schoolId,
        email: body.email,
        username: body.username,
        phone: body.phone,
        passwordHash: await hash(body.password),
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });
  }

  findRoles(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    return this.prisma.role.findMany({
      where: { OR: [{ schoolId }, { schoolId: null }] },
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: 'asc' },
    });
  }

  createRole(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.role.create({
      data: {
        schoolId,
        name: body.name,
        description: body.description,
      },
    });
  }

  assignRole(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.$transaction(async (tx) => {
      await tx.user.findFirstOrThrow({ where: { id: body.userId, schoolId } });
      await tx.role.findFirstOrThrow({
        where: { id: body.roleId, OR: [{ schoolId }, { schoolId: null }] },
      });

      return tx.userRole.upsert({
        where: { userId_roleId: { userId: body.userId, roleId: body.roleId } },
        update: {},
        create: { userId: body.userId, roleId: body.roleId },
      });
    });
  }

  findPermissions() {
    return this.prisma.permission.findMany({ orderBy: { action: 'asc' } });
  }

  assignPermission(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.$transaction(async (tx) => {
      await tx.role.findFirstOrThrow({
        where: { id: body.roleId, OR: [{ schoolId }, { schoolId: null }] },
      });
      await tx.permission.findUniqueOrThrow({ where: { id: body.permissionId } });

      return tx.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: body.roleId,
            permissionId: body.permissionId,
          },
        },
        update: {},
        create: { roleId: body.roleId, permissionId: body.permissionId },
      });
    });
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return user.schoolId;
  }
}
