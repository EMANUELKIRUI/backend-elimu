import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('invoices')
  @Permissions('finance.view')
  findInvoices(@CurrentUser() user: AuthUser) {
    return this.financeService.findInvoices(user);
  }

  @Post('invoices')
  @Permissions('finance.create')
  createInvoice(@CurrentUser() user: AuthUser, @Body() dto: CreateInvoiceDto) {
    return this.financeService.createInvoice(user, dto);
  }

  @Post('payments')
  @Permissions('finance.create')
  recordPayment(@CurrentUser() user: AuthUser, @Body() dto: RecordPaymentDto) {
    return this.financeService.recordPayment(user, dto);
  }

  @Post('expenses')
  @Permissions('finance.create')
  createExpense(@CurrentUser() user: AuthUser, @Body() dto: CreateExpenseDto) {
    return this.financeService.createExpense(user, dto);
  }

  @Patch('expenses/:expenseId/submit')
  @Permissions('finance.submit')
  submitExpense(@CurrentUser() user: AuthUser, @Param('expenseId') expenseId: string) {
    return this.financeService.updateExpenseStatus(user, expenseId, 'SUBMITTED');
  }

  @Patch('expenses/:expenseId/deputy-approve')
  @Permissions('finance.approve.deputy')
  deputyApproveExpense(
    @CurrentUser() user: AuthUser,
    @Param('expenseId') expenseId: string,
  ) {
    return this.financeService.updateExpenseStatus(
      user,
      expenseId,
      'DEPUTY_APPROVED',
    );
  }

  @Patch('expenses/:expenseId/principal-approve')
  @Permissions('finance.approve.principal')
  principalApproveExpense(
    @CurrentUser() user: AuthUser,
    @Param('expenseId') expenseId: string,
  ) {
    return this.financeService.updateExpenseStatus(
      user,
      expenseId,
      'PRINCIPAL_APPROVED',
    );
  }
}
