import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { EnterMarkDto } from './dto/enter-mark.dto';
import { GradingService } from './grading.service';

@Injectable()
export class AcademicsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly grading: GradingService,
  ) {}

  findClasses(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    return this.prisma.class.findMany({
      where: { schoolId },
      include: { streams: true },
      orderBy: { name: 'asc' },
    });
  }

  createClass(user: AuthUser, dto: CreateClassDto) {
    const schoolId = this.requireSchool(user);
    return this.prisma.class.create({ data: { schoolId, ...dto } });
  }

  findSubjects(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    return this.prisma.subject.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
    });
  }

  createSubject(user: AuthUser, dto: CreateSubjectDto) {
    const schoolId = this.requireSchool(user);
    return this.prisma.subject.create({
      data: {
        schoolId,
        name: dto.name,
        code: dto.code,
        mode: dto.mode,
        maxMarks: dto.maxMarks,
      },
    });
  }

  async createExam(user: AuthUser, dto: CreateExamDto) {
    const schoolId = this.requireSchool(user);
    await this.prisma.academicYear.findFirstOrThrow({
      where: { id: dto.academicYearId, schoolId },
    });
    await this.prisma.term.findFirstOrThrow({
      where: { id: dto.termId, academicYear: { schoolId } },
    });

    return this.prisma.exam.create({ data: { schoolId, ...dto } });
  }

  async enterMark(user: AuthUser, dto: EnterMarkDto) {
    const schoolId = this.requireSchool(user);
    const exam = await this.prisma.exam.findFirst({
      where: { id: dto.examId, schoolId },
    });

    if (!exam || exam.status === 'LOCKED') {
      throw new BadRequestException('Exam is missing or locked');
    }

    const subject = await this.prisma.subject.findFirstOrThrow({
      where: { id: dto.subjectId, schoolId },
    });
    await this.prisma.student.findFirstOrThrow({
      where: { id: dto.studentId, schoolId },
    });

    if (subject.maxMarks && dto.score > subject.maxMarks) {
      throw new BadRequestException(`Score cannot exceed ${subject.maxMarks}`);
    }

    const grade = await this.grading.gradeScore(schoolId, dto.score);

    return this.prisma.mark.upsert({
      where: {
        examId_studentId_subjectId: {
          examId: dto.examId,
          studentId: dto.studentId,
          subjectId: dto.subjectId,
        },
      },
      update: {
        score: dto.score,
        grade: grade.grade,
        points: grade.points,
      },
      create: {
        schoolId,
        examId: dto.examId,
        studentId: dto.studentId,
        subjectId: dto.subjectId,
        score: dto.score,
        grade: grade.grade,
        points: grade.points,
        createdById: user.id,
      },
    });
  }

  async getMarksheet(user: AuthUser, examId: string) {
    const schoolId = this.requireSchool(user);
    const marks = await this.prisma.mark.findMany({
      where: { schoolId, examId },
      include: { student: true, subject: true },
      orderBy: [
        { student: { admissionNumber: 'asc' } },
        { subject: { name: 'asc' } },
      ],
    });

    const byStudent = new Map<string, any>();
    for (const mark of marks) {
      const row =
        byStudent.get(mark.studentId) ??
        {
          studentId: mark.studentId,
          admissionNumber: mark.student.admissionNumber,
          studentName: `${mark.student.firstName} ${mark.student.lastName}`,
          subjects: {},
          total: 0,
          average: 0,
        };

      row.subjects[mark.subject.code] = {
        subjectName: mark.subject.name,
        score: Number(mark.score),
        grade: mark.grade,
      };
      row.total += Number(mark.score);
      row.average =
        Object.keys(row.subjects).length > 0
          ? row.total / Object.keys(row.subjects).length
          : 0;
      byStudent.set(mark.studentId, row);
    }

    return Array.from(byStudent.values())
      .sort((a, b) => b.average - a.average)
      .map((row, index) => ({ ...row, position: index + 1 }));
  }

  updateExamStatus(user: AuthUser, examId: string, status: ApprovalStatus) {
    const schoolId = this.requireSchool(user);
    return this.prisma.$transaction(async (tx) => {
      await tx.exam.findFirstOrThrow({ where: { id: examId, schoolId } });
      return tx.exam.update({
        where: { id: examId },
        data: { status },
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
