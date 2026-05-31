import { Body, Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { OperationsService } from './operations.service';

@Controller()
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Post('hr/employees/:employeeId/contracts')
  @Permissions('hr.manage')
  addContract(@CurrentUser() user: AuthUser, @Param('employeeId') employeeId: string, @Body() body: any) {
    return this.operationsService.addContract(user, employeeId, body);
  }

  @Post('hr/employees/:employeeId/leave-requests')
  @Permissions('hr.manage')
  requestLeave(@CurrentUser() user: AuthUser, @Param('employeeId') employeeId: string, @Body() body: any) {
    return this.operationsService.requestLeave(user, employeeId, body);
  }

  @Post('hr/employees/:employeeId/payroll')
  @Permissions('hr.manage')
  createPayroll(@CurrentUser() user: AuthUser, @Param('employeeId') employeeId: string, @Body() body: any) {
    return this.operationsService.createPayroll(user, employeeId, body);
  }

  @Post('hr/employees/:employeeId/reviews')
  @Permissions('hr.manage')
  createReview(@CurrentUser() user: AuthUser, @Param('employeeId') employeeId: string, @Body() body: any) {
    return this.operationsService.createReview(user, employeeId, body);
  }

  @Post('inventory/items/:itemId/movements')
  @Permissions('inventory.manage')
  recordStockMovement(@CurrentUser() user: AuthUser, @Param('itemId') itemId: string, @Body() body: any) {
    return this.operationsService.recordStockMovement(user, itemId, body);
  }

  @Post('inventory/assets/:assetId/assignments')
  @Permissions('inventory.manage')
  assignAsset(@CurrentUser() user: AuthUser, @Param('assetId') assetId: string, @Body() body: any) {
    return this.operationsService.assignAsset(user, assetId, body);
  }

  @Post('procurement/requests/:requestId/quotations')
  @Permissions('procurement.manage')
  addQuotation(@CurrentUser() user: AuthUser, @Param('requestId') requestId: string, @Body() body: any) {
    return this.operationsService.addQuotation(user, requestId, body);
  }

  @Post('procurement/requests/:requestId/orders')
  @Permissions('procurement.manage')
  createPurchaseOrder(@CurrentUser() user: AuthUser, @Param('requestId') requestId: string, @Body() body: any) {
    return this.operationsService.createPurchaseOrder(user, requestId, body);
  }

  @Post('procurement/orders/:orderId/receipts')
  @Permissions('procurement.manage')
  receiveGoods(@CurrentUser() user: AuthUser, @Param('orderId') orderId: string, @Body() body: any) {
    return this.operationsService.receiveGoods(user, orderId, body);
  }

  @Post('library/books/:bookId/borrowings')
  @Permissions('library.manage')
  borrowBook(@CurrentUser() user: AuthUser, @Param('bookId') bookId: string, @Body() body: any) {
    return this.operationsService.borrowBook(user, bookId, body);
  }

  @Post('library/borrowings/:borrowingId/return')
  @Permissions('library.manage')
  returnBook(@CurrentUser() user: AuthUser, @Param('borrowingId') borrowingId: string) {
    return this.operationsService.returnBook(user, borrowingId);
  }

  @Post('boarding/dormitories/:dormitoryId/rooms')
  @Permissions('boarding.manage')
  createRoom(@CurrentUser() user: AuthUser, @Param('dormitoryId') dormitoryId: string, @Body() body: any) {
    return this.operationsService.createRoom(user, dormitoryId, body);
  }

  @Post('boarding/rooms/:roomId/beds')
  @Permissions('boarding.manage')
  createBed(@CurrentUser() user: AuthUser, @Param('roomId') roomId: string, @Body() body: any) {
    return this.operationsService.createBed(user, roomId, body);
  }

  @Post('boarding/beds/:bedId/allocations')
  @Permissions('boarding.manage')
  allocateBed(@CurrentUser() user: AuthUser, @Param('bedId') bedId: string, @Body() body: any) {
    return this.operationsService.allocateBed(user, bedId, body);
  }

  @Post('boarding/leave-outs')
  @Permissions('boarding.manage')
  createLeaveOut(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.operationsService.createLeaveOut(user, body);
  }

  @Post('boarding/incidents')
  @Permissions('boarding.manage')
  createBoardingIncident(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.operationsService.createBoardingIncident(user, body);
  }

  @Post('transport/drivers')
  @Permissions('transport.manage')
  createDriver(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.operationsService.createDriver(user, body);
  }

  @Post('transport/routes/:routeId/pickup-points')
  @Permissions('transport.manage')
  addPickupPoint(@CurrentUser() user: AuthUser, @Param('routeId') routeId: string, @Body() body: any) {
    return this.operationsService.addPickupPoint(user, routeId, body);
  }

  @Post('transport/routes/:routeId/students')
  @Permissions('transport.manage')
  assignStudentRoute(@CurrentUser() user: AuthUser, @Param('routeId') routeId: string, @Body() body: any) {
    return this.operationsService.assignStudentRoute(user, routeId, body);
  }

  @Post('transport/vehicles/:vehicleId/fuel-logs')
  @Permissions('transport.manage')
  logFuel(@CurrentUser() user: AuthUser, @Param('vehicleId') vehicleId: string, @Body() body: any) {
    return this.operationsService.logFuel(user, vehicleId, body);
  }

  @Post('transport/vehicles/:vehicleId/maintenance')
  @Permissions('transport.manage')
  logMaintenance(@CurrentUser() user: AuthUser, @Param('vehicleId') vehicleId: string, @Body() body: any) {
    return this.operationsService.logMaintenance(user, vehicleId, body);
  }

  @Post('mobile/devices')
  @Permissions('mobile.manage')
  registerDevice(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.operationsService.registerDevice(user, body);
  }

  @Post('mobile/push-notifications')
  @Permissions('mobile.manage')
  createPushNotification(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.operationsService.createPushNotification(user, body);
  }

  @Post('analytics/dashboards')
  @Permissions('analytics.manage')
  createDashboard(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.operationsService.createDashboard(user, body);
  }
}
