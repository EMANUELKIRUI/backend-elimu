import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(user: AuthUser) {
    const schoolId = this.requireSchool(user);

    return this.prisma.student.findMany({
      where: { schoolId },
      include: { class: true, stream: true, guardians: { include: { guardian: true } } },
      orderBy: [{ class: { name: 'asc' } }, { admissionNumber: 'asc' }],
    });
  }

  create(user: AuthUser, dto: CreateStudentDto) {
    const schoolId = this.requireSchool(user);

    return this.prisma.student.create({
      data: {
        schoolId,
        admissionNumber: dto.admissionNumber,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        classId: dto.classId,
        streamId: dto.streamId,
      },
    });
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return user.schoolId;
  }
}
