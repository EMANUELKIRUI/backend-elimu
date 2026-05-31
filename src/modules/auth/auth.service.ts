import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from '@node-rs/argon2';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier },
          { username: dto.identifier },
          { phone: dto.identifier },
        ],
      },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
        departments: { include: { department: true } },
      },
    });

    if (!user || !(await verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      schoolId: user.schoolId,
      roles: user.roles.map(({ role }) => role.name),
      permissions: user.roles.flatMap(({ role }) =>
        role.permissions.map(({ permission }) => permission.action),
      ),
      departments: user.departments.map(({ department, isHod }) => ({
        id: department.id,
        code: department.code,
        moduleKey: department.moduleKey,
        isHod,
      })),
    };

    const accessToken = await this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET', 'dev-access-secret'),
        expiresIn: this.config.get<string>('JWT_ACCESS_TTL', '15m'),
      });
    const refreshToken = await this.jwt.signAsync(payload, {
        secret: this.config.get<string>(
          'JWT_REFRESH_SECRET',
          'dev-refresh-secret',
        ),
        expiresIn: this.config.get<string>('JWT_REFRESH_TTL', '30d'),
      });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshHash: await hash(refreshToken) },
    });

    return {
      accessToken,
      refreshToken,
      user: payload,
    };
  }

  async logout(user: AuthUser) {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshHash: null },
    });

    return { loggedOut: true };
  }

  async changePassword(user: AuthUser, dto: ChangePasswordDto) {
    const account = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });

    if (!(await verify(account.passwordHash, dto.currentPassword))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hash(dto.newPassword),
        refreshHash: null,
      },
    });

    return { changed: true };
  }
}
