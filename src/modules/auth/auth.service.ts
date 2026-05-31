import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from '@node-rs/argon2';
import { randomBytes, randomInt } from 'crypto';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';

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
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        refreshHash: await hash(refreshToken),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
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

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.identifier },
          { username: dto.identifier },
          { phone: dto.identifier },
        ],
      },
    });

    if (!user) {
      return { accepted: true };
    }

    const token = randomBytes(32).toString('hex');
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: await hash(token),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    return {
      accepted: true,
      resetToken: this.config.get<string>('NODE_ENV') === 'production' ? undefined : token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokens = await this.prisma.passwordResetToken.findMany({
      where: {
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    let token: (typeof tokens)[number] | undefined;
    for (const item of tokens) {
      if (await verify(item.tokenHash, dto.token)) {
        token = item;
        break;
      }
    }

    if (!token) {
      throw new NotFoundException('Reset token is invalid or expired');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: token.userId },
        data: {
          passwordHash: await hash(dto.newPassword),
          refreshHash: null,
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.userSession.updateMany({
        where: { userId: token.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { reset: true };
  }

  async startMfa(user: AuthUser) {
    const code = randomInt(100000, 999999).toString();
    const challenge = await this.prisma.mfaChallenge.create({
      data: {
        userId: user.id,
        codeHash: await hash(code),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return {
      challengeId: challenge.id,
      code: this.config.get<string>('NODE_ENV') === 'production' ? undefined : code,
    };
  }

  async verifyMfa(user: AuthUser, dto: VerifyMfaDto) {
    const challenge = await this.prisma.mfaChallenge.findFirstOrThrow({
      where: {
        id: dto.challengeId,
        userId: user.id,
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!(await verify(challenge.codeHash, dto.code))) {
      throw new UnauthorizedException('Invalid MFA code');
    }

    await this.prisma.mfaChallenge.update({
      where: { id: challenge.id },
      data: { verifiedAt: new Date() },
    });

    return { verified: true };
  }

  async sessions(user: AuthUser) {
    return this.prisma.userSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }
}
