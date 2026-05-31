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
    const schoolId = this.requireSchool(user);

    return this.prisma.school.findUniqueOrThrow({
      where: { id: schoolId },
      include: {
        settings: true,
        departments: true,
        academicYears: { include: { terms: true } },
        subscriptions: { include: { package: true } },
      },
    });
  }

  upsertSetting(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.schoolSetting.upsert({
      where: { schoolId_key: { schoolId, key: body.key } },
      update: { value: body.value },
      create: { schoolId, key: body.key, value: body.value },
    });
  }

  createAcademicYear(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.academicYear.create({
      data: {
        schoolId,
        name: body.name,
        startsAt: new Date(body.startsAt),
        endsAt: new Date(body.endsAt),
        isActive: body.isActive ?? false,
      },
    });
  }

  async createTerm(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.academicYear.findFirstOrThrow({
      where: { id: body.academicYearId, schoolId },
    });

    return this.prisma.term.create({
      data: {
        academicYearId: body.academicYearId,
        name: body.name,
        startsAt: new Date(body.startsAt),
        endsAt: new Date(body.endsAt),
        isActive: body.isActive ?? false,
      },
    });
  }

  createDepartment(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.department.create({
      data: {
        schoolId,
        name: body.name,
        code: body.code,
        moduleKey: body.moduleKey,
      },
    });
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('This user is not assigned to a school');
    }

    return user.schoolId;
  }
}
