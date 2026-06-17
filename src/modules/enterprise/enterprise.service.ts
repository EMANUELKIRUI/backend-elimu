import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

type ResourceConfig = {
  delegate: string;
  orderBy?: Record<string, string>;
  withUserId?: boolean;
};

@Injectable()
export class EnterpriseService {
  private readonly resources: Record<string, ResourceConfig> = {
    learningAreas: { delegate: 'learningArea', orderBy: { name: 'asc' } },
    learnerCompetencies: { delegate: 'learnerCompetency', orderBy: { assessedAt: 'desc' } },
    courses: { delegate: 'course', orderBy: { createdAt: 'desc' } },
    employees: { delegate: 'employee', orderBy: { lastName: 'asc' } },
    inventoryItems: { delegate: 'inventoryItem', orderBy: { name: 'asc' } },
    assets: { delegate: 'assetRegister', orderBy: { createdAt: 'desc' } },
    suppliers: { delegate: 'supplier', orderBy: { name: 'asc' } },
    purchaseRequests: { delegate: 'purchaseRequest', orderBy: { createdAt: 'desc' } },
    libraryBooks: { delegate: 'libraryBook', orderBy: { title: 'asc' } },
    dormitories: { delegate: 'dormitory', orderBy: { name: 'asc' } },
    vehicles: { delegate: 'vehicle', orderBy: { plate: 'asc' } },
    transportRoutes: { delegate: 'transportRoute', orderBy: { name: 'asc' } },
    smsLogs: { delegate: 'smsLog', orderBy: { createdAt: 'desc' } },
    emailLogs: { delegate: 'emailLog', orderBy: { createdAt: 'desc' } },
    messageTemplates: { delegate: 'messageTemplate', orderBy: { name: 'asc' } },
    analyticsSnapshots: { delegate: 'analyticsSnapshot', orderBy: { createdAt: 'desc' } },
    governmentSubmissions: { delegate: 'governmentSubmission', orderBy: { createdAt: 'desc' } },
    nationalExamCandidates: { delegate: 'nationalExamCandidate' },
    countryConfigs: { delegate: 'countryConfig', orderBy: { country: 'asc' } },
    aiJobs: { delegate: 'aiJob', orderBy: { createdAt: 'desc' }, withUserId: true },
    disciplineCases: { delegate: 'disciplineCase', orderBy: { occurredAt: 'desc' } },
    counselingNotes: { delegate: 'counselingNote', orderBy: { recordedAt: 'desc' } },
    events: { delegate: 'schoolEvent', orderBy: { startsAt: 'asc' } },
    eventAttendances: { delegate: 'eventAttendance' },
    buildings: { delegate: 'building', orderBy: { name: 'asc' } },
    classrooms: { delegate: 'classroomFacility', orderBy: { name: 'asc' } },
    facilities: { delegate: 'facility', orderBy: { name: 'asc' } },
    maintenanceRecords: { delegate: 'maintenanceRecord', orderBy: { reportedAt: 'desc' } },
    inspectionTemplates: { delegate: 'inspectionTemplate', orderBy: { name: 'asc' } },
    inspections: { delegate: 'inspection', orderBy: { createdAt: 'desc' } },
    complianceActions: { delegate: 'complianceAction', orderBy: { createdAt: 'desc' } },
    geoRegions: { delegate: 'geoRegion', orderBy: { name: 'asc' } },
    locations: { delegate: 'location', orderBy: { createdAt: 'desc' } },
  };

  constructor(private readonly prisma: PrismaService) {}

  list(user: AuthUser, resource: string) {
    const schoolId = this.requireSchool(user);
    const config = this.getResource(resource);
    return this.delegate(config).findMany({
      where: { schoolId },
      ...(config.orderBy ? { orderBy: config.orderBy } : {}),
    });
  }

  create(user: AuthUser, resource: string, body: any) {
    const schoolId = this.requireSchool(user);
    const config = this.getResource(resource);
    return this.delegate(config).create({
      data: {
        schoolId,
        ...(config.withUserId ? { userId: user.id } : {}),
        ...body,
      },
    });
  }

  private delegate(config: ResourceConfig) {
    return (this.prisma as any)[config.delegate];
  }

  private getResource(resource: string) {
    const config = this.resources[resource];
    if (!config) {
      throw new NotFoundException(`Unsupported enterprise resource: ${resource}`);
    }

    return config;
  }

  private requireSchool(user: AuthUser) {
    if (!user.schoolId) {
      throw new ForbiddenException('School-scoped user required');
    }

    return user.schoolId;
  }
}
