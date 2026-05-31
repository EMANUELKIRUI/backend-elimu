import { ForbiddenException, Injectable } from '@nestjs/common';
import { ReportType } from '@prisma/client';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async academicSummary(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    const [students, exams, marks] = await Promise.all([
      this.prisma.student.count({ where: { schoolId } }),
      this.prisma.exam.count({ where: { schoolId } }),
      this.prisma.mark.findMany({
        where: { schoolId },
        select: { score: true },
      }),
    ]);

    const totalScore = marks.reduce((sum, mark) => sum + Number(mark.score), 0);

    return {
      students,
      exams,
      marks: marks.length,
      averageScore: marks.length ? totalScore / marks.length : 0,
    };
  }

  async attendanceSummary(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    const [studentRecords, staffRecords] = await Promise.all([
      this.prisma.studentAttendance.groupBy({
        by: ['status'],
        where: { schoolId },
        _count: { status: true },
      }),
      this.prisma.staffAttendance.groupBy({
        by: ['status'],
        where: { schoolId },
        _count: { status: true },
      }),
    ]);

    return {
      students: studentRecords.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      staff: staffRecords.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
    };
  }

  async financeSummary(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    const [invoices, payments, expenses] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { schoolId },
        select: { amount: true, balance: true },
      }),
      this.prisma.payment.findMany({
        where: { schoolId },
        select: { amount: true },
      }),
      this.prisma.expense.findMany({
        where: { schoolId },
        select: { amount: true, status: true },
      }),
    ]);

    return {
      invoiced: this.sumDecimal(invoices.map((invoice) => invoice.amount)),
      outstanding: this.sumDecimal(invoices.map((invoice) => invoice.balance)),
      collected: this.sumDecimal(payments.map((payment) => payment.amount)),
      expenses: this.sumDecimal(expenses.map((expense) => expense.amount)),
      pendingExpenses: expenses.filter((expense) => expense.status !== 'PAID').length,
    };
  }

  async saveSnapshot(user: AuthUser, type: ReportType, title: string, payload: unknown) {
    const schoolId = this.requireSchool(user);

    return this.prisma.reportSnapshot.create({
      data: {
        schoolId,
        type,
        title,
        payload: payload as object,
      },
    });
  }

  private sumDecimal(values: unknown[]) {
    return values.reduce<number>((sum, value) => sum + Number(value), 0);
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return user.schoolId;
  }
}
