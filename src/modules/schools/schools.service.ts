import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSchoolDto) {
    return this.prisma.school.create({ data: dto });
  }

  findOneForUser(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('This user is not assigned to a school');
    }

    return this.prisma.school.findUniqueOrThrow({
      where: { id: user.schoolId },
      include: {
        departments: true,
        academicYears: { include: { terms: true } },
        subscriptions: { include: { package: true } },
      },
    });
  }
}
