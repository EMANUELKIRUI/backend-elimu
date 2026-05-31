import { ForbiddenException, Injectable } from '@nestjs/common';
import { FinanceRequestStatus, Prisma } from '@prisma/client';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  findInvoices(user: AuthUser) {
    const schoolId = this.requireSchool(user);
    return this.prisma.invoice.findMany({
      where: { schoolId },
      include: { student: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  createInvoice(user: AuthUser, dto: CreateInvoiceDto) {
    const schoolId = this.requireSchool(user);
    return this.prisma.invoice.create({
      data: {
        schoolId,
        studentId: dto.studentId,
        number: dto.number,
        amount: dto.amount,
        balance: dto.amount,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  recordPayment(user: AuthUser, dto: RecordPaymentDto) {
    const schoolId = this.requireSchool(user);

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          schoolId,
          studentId: dto.studentId,
          invoiceId: dto.invoiceId,
          amount: dto.amount,
          method: dto.method,
          reference: dto.reference,
        },
      });

      if (dto.invoiceId) {
        await tx.invoice.update({
          where: { id: dto.invoiceId },
          data: { balance: { decrement: new Prisma.Decimal(dto.amount) } },
        });
      }

      return payment;
    });
  }

  createExpense(user: AuthUser, dto: CreateExpenseDto) {
    const schoolId = this.requireSchool(user);
    return this.prisma.expense.create({
      data: { schoolId, ...dto },
    });
  }

  async updateExpenseStatus(
    user: AuthUser,
    expenseId: string,
    status: FinanceRequestStatus,
  ) {
    const schoolId = this.requireSchool(user);
    await this.prisma.expense.findFirstOrThrow({
      where: { id: expenseId, schoolId },
    });

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: { status },
    });
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return user.schoolId;
  }
}
