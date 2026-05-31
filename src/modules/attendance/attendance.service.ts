import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { RecordStaffAttendanceDto } from './dto/record-staff-attendance.dto';
import { RecordStudentAttendanceDto } from './dto/record-student-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  findStudentAttendance(user: AuthUser, date?: string) {
    const schoolId = this.requireSchool(user);

    return this.prisma.studentAttendance.findMany({
      where: {
        schoolId,
        ...(date ? { date: new Date(date) } : {}),
      },
      include: { student: true },
      orderBy: [{ date: 'desc' }, { student: { admissionNumber: 'asc' } }],
    });
  }

  async recordStudentAttendance(user: AuthUser, dto: RecordStudentAttendanceDto) {
    const schoolId = this.requireSchool(user);
    await this.prisma.student.findFirstOrThrow({
      where: { id: dto.studentId, schoolId },
    });

    return this.prisma.studentAttendance.upsert({
      where: {
        studentId_date: {
          studentId: dto.studentId,
          date: new Date(dto.date),
        },
      },
      update: {
        status: dto.status,
        notes: dto.notes,
      },
      create: {
        schoolId,
        studentId: dto.studentId,
        date: new Date(dto.date),
        status: dto.status,
        notes: dto.notes,
      },
    });
  }

  findStaffAttendance(user: AuthUser, date?: string) {
    const schoolId = this.requireSchool(user);

    return this.prisma.staffAttendance.findMany({
      where: {
        schoolId,
        ...(date ? { date: new Date(date) } : {}),
      },
      include: { user: true },
      orderBy: [{ date: 'desc' }, { user: { lastName: 'asc' } }],
    });
  }

  async recordStaffAttendance(user: AuthUser, dto: RecordStaffAttendanceDto) {
    const schoolId = this.requireSchool(user);
    await this.prisma.user.findFirstOrThrow({
      where: { id: dto.userId, schoolId },
    });

    return this.prisma.staffAttendance.upsert({
      where: {
        userId_date: {
          userId: dto.userId,
          date: new Date(dto.date),
        },
      },
      update: {
        status: dto.status,
        notes: dto.notes,
      },
      create: {
        schoolId,
        userId: dto.userId,
        date: new Date(dto.date),
        status: dto.status,
        notes: dto.notes,
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
