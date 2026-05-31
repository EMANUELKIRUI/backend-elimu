import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { PanAfricaService } from './pan-africa.service';

@Controller()
export class PanAfricaController {
  constructor(private readonly panAfricaService: PanAfricaService) {}

  @Get('ministries/profiles')
  @Permissions('pan_africa.view')
  ministryProfiles(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'ministryProfiles');
  }

  @Post('ministries/profiles')
  @Permissions('pan_africa.manage')
  createMinistryProfile(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'ministryProfiles', body);
  }

  @Get('integrations/endpoints')
  @Permissions('integrations.view')
  integrationEndpoints(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'integrationEndpoints');
  }

  @Post('integrations/endpoints')
  @Permissions('integrations.manage')
  createIntegrationEndpoint(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'integrationEndpoints', body);
  }

  @Get('integrations/sync-logs')
  @Permissions('integrations.view')
  integrationSyncLogs(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'integrationSyncLogs');
  }

  @Patch('integrations/government-submissions/:submissionId/sent')
  @Permissions('integrations.manage')
  markIntegrationSent(
    @CurrentUser() user: AuthUser,
    @Param('submissionId') submissionId: string,
    @Body() body: any,
  ) {
    return this.panAfricaService.markIntegrationSent(user, submissionId, body);
  }

  @Patch('integrations/national-exam-candidates/:candidateId/sync')
  @Permissions('integrations.manage')
  syncNationalExamCandidate(
    @CurrentUser() user: AuthUser,
    @Param('candidateId') candidateId: string,
    @Body() body: any,
  ) {
    return this.panAfricaService.syncNationalExamCandidate(user, candidateId, body);
  }

  @Get('compliance/reports')
  @Permissions('compliance.view')
  complianceReports(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'complianceReports');
  }

  @Post('compliance/reports')
  @Permissions('compliance.manage')
  createComplianceReport(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'complianceReports', body);
  }

  @Get('compliance/retention-policies')
  @Permissions('compliance.view')
  dataRetentionPolicies(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'dataRetentionPolicies');
  }

  @Post('compliance/retention-policies')
  @Permissions('compliance.manage')
  createDataRetentionPolicy(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'dataRetentionPolicies', body);
  }

  @Get('compliance/consents')
  @Permissions('compliance.view')
  consentRecords(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'consentRecords');
  }

  @Post('compliance/consents')
  @Permissions('compliance.manage')
  createConsentRecord(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'consentRecords', body);
  }

  @Get('data-exports')
  @Permissions('data_exports.view')
  dataExportJobs(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'dataExportJobs');
  }

  @Post('data-exports')
  @Permissions('data_exports.manage')
  createDataExport(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'dataExportJobs', body);
  }

  @Patch('data-exports/:exportId/complete')
  @Permissions('data_exports.manage')
  completeDataExport(
    @CurrentUser() user: AuthUser,
    @Param('exportId') exportId: string,
    @Body() body: any,
  ) {
    return this.panAfricaService.completeDataExport(user, exportId, body);
  }

  @Get('education-intelligence/metrics')
  @Permissions('intelligence.view')
  anonymizedMetrics(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'anonymizedMetrics');
  }

  @Post('education-intelligence/metrics')
  @Permissions('intelligence.manage')
  createAnonymizedMetric(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'anonymizedMetrics', body);
  }

  @Get('education-intelligence/reports')
  @Permissions('intelligence.view')
  intelligenceReports(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'intelligenceReports');
  }

  @Post('education-intelligence/reports')
  @Permissions('intelligence.manage')
  createIntelligenceReport(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'intelligenceReports', body);
  }

  @Get('backups')
  @Permissions('operations.view')
  backupJobs(@CurrentUser() user: AuthUser) {
    return this.panAfricaService.list(user, 'backupJobs');
  }

  @Post('backups')
  @Permissions('operations.manage')
  createBackup(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.panAfricaService.create(user, 'backupJobs', body);
  }

  @Patch('backups/:backupId/complete')
  @Permissions('operations.manage')
  completeBackup(
    @CurrentUser() user: AuthUser,
    @Param('backupId') backupId: string,
    @Body() body: any,
  ) {
    return this.panAfricaService.completeBackup(user, backupId, body);
  }
}
