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

  async create(user: AuthUser, dto: CreateStudentDto) {
    const schoolId = this.requireSchool(user);
    if (dto.classId) {
      await this.prisma.class.findFirstOrThrow({
        where: { id: dto.classId, schoolId },
      });
    }
    if (dto.streamId) {
      await this.prisma.stream.findFirstOrThrow({
        where: { id: dto.streamId, schoolId, classId: dto.classId },
      });
    }

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

  async addGuardian(user: AuthUser, studentId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.student.findFirstOrThrow({ where: { id: studentId, schoolId } });

    return this.prisma.$transaction(async (tx) => {
      const guardian = await tx.guardian.create({
        data: {
          schoolId,
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          email: body.email,
        },
      });

      return tx.studentGuardian.create({
        data: {
          studentId,
          guardianId: guardian.id,
          relation: body.relation,
          primary: body.primary ?? false,
        },
      });
    });
  }

  async addDocument(user: AuthUser, studentId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.student.findFirstOrThrow({ where: { id: studentId, schoolId } });

    return this.prisma.studentDocument.create({
      data: { schoolId, studentId, title: body.title, fileUrl: body.fileUrl, type: body.type },
    });
  }

  async addMedicalRecord(user: AuthUser, studentId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.student.findFirstOrThrow({ where: { id: studentId, schoolId } });

    return this.prisma.studentMedicalRecord.create({
      data: {
        schoolId,
        studentId,
        condition: body.condition,
        notes: body.notes,
      },
    });
  }

  async transfer(user: AuthUser, studentId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.student.findFirstOrThrow({ where: { id: studentId, schoolId } });

    return this.prisma.$transaction([
      this.prisma.studentTransfer.create({
        data: {
          schoolId,
          studentId,
          fromSchool: body.fromSchool,
          toSchool: body.toSchool,
          reason: body.reason,
        },
      }),
      this.prisma.student.update({
        where: { id: studentId },
        data: { status: body.status ?? 'TRANSFERRED' },
      }),
    ]);
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return user.schoolId;
  }
}
