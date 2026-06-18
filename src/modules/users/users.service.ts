import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from '@node-rs/argon2';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: AuthUser) {
    const where = user.schoolId
      ? { schoolId: user.schoolId }
      : undefined;

    return this.prisma.user.findMany({
      where,
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: AuthUser, dto: CreateUserDto) {
    const schoolId = dto.schoolId ?? user.schoolId;
    if (!schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return this.prisma.user.create({
      data: {
        schoolId,
        email: dto.email,
        username: dto.username,
        phone: dto.phone,
        passwordHash: await hash(dto.password),
        firstName: dto.firstName,
        lastName: dto.lastName,
        mfaEnabled: dto.mfaEnabled ?? false,
        roles: dto.roleIds
          ? {
              create: dto.roleIds.map((roleId) => ({
                role: { connect: { id: roleId } },
              })),
            }
          : undefined,
      },
      include: {
        roles: { include: { role: true } },
      },
    });
  }

  async update(user: AuthUser, id: string, dto: UpdateUserDto) {
    const schoolId = user.schoolId;
    const existing = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { roles: true },
    });

    if (schoolId && existing.schoolId !== schoolId) {
      throw new ForbiddenException('Cannot update users outside your school');
    }

    const data: any = {
      email: dto.email,
      username: dto.username,
      phone: dto.phone,
      firstName: dto.firstName,
      lastName: dto.lastName,
      mfaEnabled: dto.mfaEnabled,
    };

    if (dto.password) {
      data.passwordHash = await hash(dto.password);
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.roleIds) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        data.roles = {
          create: dto.roleIds.map((roleId) => ({
            role: { connect: { id: roleId } },
          })),
        };
      }

      return tx.user.update({
        where: { id },
        data,
        include: { roles: { include: { role: true } } },
      });
    });
  }

  async remove(user: AuthUser, id: string) {
    const schoolId = user.schoolId;
    const existing = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    if (schoolId && existing.schoolId !== schoolId) {
      throw new ForbiddenException('Cannot delete users outside your school');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
