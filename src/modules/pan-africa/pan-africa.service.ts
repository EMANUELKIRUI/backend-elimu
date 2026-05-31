import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthUser } from '../../common/types/auth-user';
import { PrismaService } from '../prisma/prisma.service';

type ResourceConfig = {
  delegate: string;
  orderBy?: Record<string, string>;
  withUserId?: 'createdById' | 'requestedById';
  schoolOptional?: boolean;
};

@Injectable()
export class PanAfricaService {
  private readonly resources: Record<string, ResourceConfig> = {
    ministryProfiles: { delegate: 'ministryProfile', orderBy: { country: 'asc' } },
    integrationEndpoints: { delegate: 'integrationEndpoint', orderBy: { createdAt: 'desc' } },
    integrationSyncLogs: { delegate: 'integrationSyncLog', orderBy: { createdAt: 'desc' } },
    complianceReports: {
      delegate: 'complianceReport',
      orderBy: { createdAt: 'desc' },
      withUserId: 'createdById',
    },
    dataExportJobs: {
      delegate: 'dataExportJob',
      orderBy: { createdAt: 'desc' },
      withUserId: 'requestedById',
    },
    dataRetentionPolicies: { delegate: 'dataRetentionPolicy', orderBy: { dataDomain: 'asc' } },
    consentRecords: { delegate: 'consentRecord', orderBy: { recordedAt: 'desc' } },
    anonymizedMetrics: {
      delegate: 'anonymizedEducationMetric',
      orderBy: { createdAt: 'desc' },
      schoolOptional: true,
    },
    intelligenceReports: {
      delegate: 'educationIntelligenceReport',
      orderBy: { createdAt: 'desc' },
      schoolOptional: true,
    },
    backupJobs: {
      delegate: 'backupJob',
      orderBy: { createdAt: 'desc' },
      schoolOptional: true,
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  list(user: AuthUser, resource: string) {
    const config = this.getResource(resource);
    const schoolId = this.requireSchool(user);
    return this.delegate(config).findMany({
      where: config.schoolOptional ? { OR: [{ schoolId }, { schoolId: null }] } : { schoolId },
      ...(config.orderBy ? { orderBy: config.orderBy } : {}),
    });
  }

  create(user: AuthUser, resource: string, body: any) {
    const config = this.getResource(resource);
    const schoolId = this.requireSchool(user);
    return this.delegate(config).create({
      data: {
        schoolId,
        ...(config.withUserId ? { [config.withUserId]: user.id } : {}),
        ...body,
      },
    });
  }

  async markIntegrationSent(user: AuthUser, submissionId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.governmentSubmission.findFirstOrThrow({
      where: { id: submissionId, schoolId },
    });

    return this.prisma.$transaction(async (tx) => {
      const submission = await tx.governmentSubmission.update({
        where: { id: submissionId },
        data: { status: body.status ?? 'SENT' },
      });
      await tx.integrationSyncLog.create({
        data: {
          schoolId,
          type: `government.${submission.type}`,
          request: submission.payload ?? Prisma.JsonNull,
          response: body.response,
          status: body.status ?? 'SENT',
          error: body.error,
        },
      });
      return submission;
    });
  }

  async syncNationalExamCandidate(user: AuthUser, candidateId: string, body: any) {
    const schoolId = this.requireSchool(user);
    await this.prisma.nationalExamCandidate.findFirstOrThrow({
      where: { id: candidateId, schoolId },
    });

    return this.prisma.nationalExamCandidate.update({
      where: { id: candidateId },
      data: {
        status: body.status ?? 'SYNCED',
        candidateNo: body.candidateNo,
      },
    });
  }

  completeDataExport(user: AuthUser, exportId: string, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.dataExportJob.update({
      where: { id: exportId },
      data: {
        status: body.status ?? 'COMPLETED',
        fileUrl: body.fileUrl,
        completedAt: new Date(),
      },
    }).then(async (job) => {
      if (job.schoolId !== schoolId) {
        throw new ForbiddenException('Export job belongs to another school');
      }
      return job;
    });
  }

  completeBackup(user: AuthUser, backupId: string, body: any) {
    const schoolId = this.requireSchool(user);
    return this.prisma.backupJob.update({
      where: { id: backupId },
      data: {
        status: body.status ?? 'COMPLETED',
        storageUrl: body.storageUrl,
        error: body.error,
        completedAt: new Date(),
      },
    }).then(async (job) => {
      if (job.schoolId && job.schoolId !== schoolId) {
        throw new ForbiddenException('Backup job belongs to another school');
      }
      return job;
    });
  }

  private delegate(config: ResourceConfig) {
    return (this.prisma as any)[config.delegate];
  }

  private getResource(resource: string) {
    const config = this.resources[resource];
    if (!config) {
      throw new NotFoundException(`Unsupported pan-African resource: ${resource}`);
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
