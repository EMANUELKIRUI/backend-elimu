import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async addContract(user: AuthUser, employeeId: string, body: any) {
    await this.ensureEmployee(user, employeeId);
    return this.prisma.contract.create({
      data: {
        employeeId,
        type: body.type,
        startsAt: new Date(body.startsAt),
        endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
        salary: body.salary,
        fileUrl: body.fileUrl,
      },
    });
  }

  async requestLeave(user: AuthUser, employeeId: string, body: any) {
    await this.ensureEmployee(user, employeeId);
    return this.prisma.leaveRequest.create({
      data: {
        employeeId,
        userId: user.id,
        type: body.type,
        startsAt: new Date(body.startsAt),
        endsAt: new Date(body.endsAt),
        reason: body.reason,
        status: body.status ?? 'SUBMITTED',
      },
    });
  }

  async createPayroll(user: AuthUser, employeeId: string, body: any) {
    await this.ensureEmployee(user, employeeId);
    return this.prisma.payroll.create({
      data: {
        employeeId,
        period: body.period,
        grossAmount: body.grossAmount,
        deductions: body.deductions ?? 0,
        netAmount: body.netAmount,
        paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
      },
    });
  }

  async createReview(user: AuthUser, employeeId: string, body: any) {
    await this.ensureEmployee(user, employeeId);
    return this.prisma.performanceReview.create({
      data: {
        employeeId,
        period: body.period,
        score: body.score,
        notes: body.notes,
      },
    });
  }

  async recordStockMovement(user: AuthUser, itemId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.inventoryItem.findFirstOrThrow({ where: { id: itemId, schoolId } });
    const quantity = Number(body.quantity);
    const delta = body.type === 'OUT' ? -quantity : quantity;

    return this.prisma.$transaction(async (tx) => {
      const movement = await tx.stockMovement.create({
        data: {
          itemId,
          type: body.type,
          quantity,
          reason: body.reason,
        },
      });
      await tx.inventoryItem.update({
        where: { id: itemId },
        data: { quantity: { increment: delta } },
      });
      return movement;
    });
  }

  async assignAsset(user: AuthUser, assetId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.assetRegister.findFirstOrThrow({ where: { id: assetId, schoolId } });
    if (body.userId) {
      await this.prisma.user.findFirstOrThrow({ where: { id: body.userId, schoolId } });
    }
    return this.prisma.assetAssignment.create({
      data: {
        assetId,
        userId: body.userId,
        location: body.location,
      },
    });
  }

  async addQuotation(user: AuthUser, purchaseRequestId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.purchaseRequest.findFirstOrThrow({
      where: { id: purchaseRequestId, schoolId },
    });
    await this.prisma.supplier.findFirstOrThrow({ where: { id: body.supplierId, schoolId } });
    return this.prisma.quotation.create({
      data: {
        purchaseRequestId,
        supplierId: body.supplierId,
        amount: body.amount,
        fileUrl: body.fileUrl,
      },
    });
  }

  async createPurchaseOrder(user: AuthUser, purchaseRequestId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.purchaseRequest.findFirstOrThrow({
      where: { id: purchaseRequestId, schoolId },
    });
    await this.prisma.supplier.findFirstOrThrow({ where: { id: body.supplierId, schoolId } });
    return this.prisma.purchaseOrder.create({
      data: {
        schoolId,
        purchaseRequestId,
        supplierId: body.supplierId,
        number: body.number,
        status: body.status ?? 'ORDERED',
      },
    });
  }

  async receiveGoods(user: AuthUser, purchaseOrderId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.purchaseOrder.findFirstOrThrow({
      where: { id: purchaseOrderId, schoolId },
    });
    return this.prisma.goodsReceivedNote.create({
      data: {
        purchaseOrderId,
        notes: body.notes,
      },
    });
  }

  async borrowBook(user: AuthUser, bookId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.libraryBook.findFirstOrThrow({ where: { id: bookId, schoolId } });
    await this.prisma.student.findFirstOrThrow({ where: { id: body.studentId, schoolId } });
    return this.prisma.libraryBorrowing.create({
      data: {
        bookId,
        studentId: body.studentId,
        dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
      },
    });
  }

  async returnBook(user: AuthUser, borrowingId: string) {
    const schoolId = this.requireSchool(user);
    await this.prisma.libraryBorrowing.findFirstOrThrow({
      where: { id: borrowingId, book: { schoolId } },
    });
    return this.prisma.libraryBorrowing.update({
      where: { id: borrowingId },
      data: { returnedAt: new Date(), status: 'RETURNED' },
    });
  }

  async createRoom(user: AuthUser, dormitoryId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.dormitory.findFirstOrThrow({ where: { id: dormitoryId, schoolId } });
    return this.prisma.boardingRoom.create({
      data: { dormitoryId, name: body.name, capacity: body.capacity },
    });
  }

  async createBed(user: AuthUser, roomId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.boardingRoom.findFirstOrThrow({
      where: { id: roomId, dormitory: { schoolId } },
    });
    return this.prisma.bed.create({ data: { roomId, label: body.label } });
  }

  async allocateBed(user: AuthUser, bedId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.bed.findFirstOrThrow({
      where: { id: bedId, room: { dormitory: { schoolId } } },
    });
    await this.prisma.student.findFirstOrThrow({ where: { id: body.studentId, schoolId } });
    return this.prisma.bedAllocation.create({
      data: { bedId, studentId: body.studentId },
    });
  }

  createLeaveOut(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.leaveOut.create({
      data: {
        schoolId,
        studentId: body.studentId,
        reason: body.reason,
        startsAt: new Date(body.startsAt),
        endsAt: new Date(body.endsAt),
        approved: body.approved ?? false,
      },
    });
  }

  createBoardingIncident(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.boardingIncident.create({
      data: {
        schoolId,
        studentId: body.studentId,
        title: body.title,
        notes: body.notes,
      },
    });
  }

  createDriver(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.driver.create({
      data: {
        schoolId,
        name: body.name,
        phone: body.phone,
        licenseNo: body.licenseNo,
      },
    });
  }

  async addPickupPoint(user: AuthUser, routeId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.transportRoute.findFirstOrThrow({ where: { id: routeId, schoolId } });
    return this.prisma.pickupPoint.create({
      data: { routeId, name: body.name, sequence: body.sequence ?? 0 },
    });
  }

  async assignStudentRoute(user: AuthUser, routeId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.transportRoute.findFirstOrThrow({ where: { id: routeId, schoolId } });
    await this.prisma.student.findFirstOrThrow({ where: { id: body.studentId, schoolId } });
    return this.prisma.studentTransportAssignment.create({
      data: { routeId, studentId: body.studentId },
    });
  }

  async logFuel(user: AuthUser, vehicleId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.vehicle.findFirstOrThrow({ where: { id: vehicleId, schoolId } });
    return this.prisma.fuelLog.create({
      data: { vehicleId, liters: body.liters, cost: body.cost },
    });
  }

  async logMaintenance(user: AuthUser, vehicleId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.vehicle.findFirstOrThrow({ where: { id: vehicleId, schoolId } });
    return this.prisma.vehicleMaintenanceRecord.create({
      data: { vehicleId, title: body.title, cost: body.cost },
    });
  }

  registerDevice(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.mobileDevice.upsert({
      where: { platform_token: { platform: body.platform, token: body.token } },
      update: { userId: user.id, schoolId, lastSeenAt: new Date() },
      create: { schoolId, userId: user.id, platform: body.platform, token: body.token },
    });
  }

  createPushNotification(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.pushNotification.create({
      data: {
        schoolId,
        userId: body.userId,
        title: body.title,
        body: body.body,
        data: body.data,
      },
    });
  }

  createDashboard(user: AuthUser, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.analyticsDashboard.upsert({
      where: { schoolId_name: { schoolId, name: body.name } },
      update: { widgets: body.widgets },
      create: { schoolId, name: body.name, widgets: body.widgets },
    });
  }

  private async ensureEmployee(user: AuthUser, employeeId: string) {
    const schoolId = this.requireSchool(user);
    await this.prisma.employee.findFirstOrThrow({ where: { id: employeeId, schoolId } });
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return user.schoolId;
  }
}
