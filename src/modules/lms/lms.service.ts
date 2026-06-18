import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LmsService {
  constructor(private readonly prisma: PrismaService) {}

  findCourses(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    return this.prisma.course.findMany({
      where: { schoolId },
      include: { lessons: true, assignments: true, quizzes: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  createCourse(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.course.create({
      data: {
        schoolId,
        title: body.title,
        description: body.description,
        subjectId: body.subjectId,
        teacherId: body.teacherId,
      },
    });
  }

  findLessons(user: AuthUser, courseId: string) {
    const schoolId = this.requireSchool(user);
    return this.prisma.lesson.findMany({
      where: { courseId, course: { schoolId } },
      orderBy: { sequence: 'asc' },
    });
  }

  async createLesson(user: AuthUser, courseId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.course.findFirstOrThrow({ where: { id: courseId, schoolId } });

    return this.prisma.lesson.create({
      data: {
        courseId,
        title: body.title,
        content: body.content,
        fileUrl: body.fileUrl,
        sequence: body.sequence ?? 0,
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
