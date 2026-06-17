import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { EnterpriseService } from './enterprise.service';

@Controller()
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Get('curriculum/learning-areas')
  @Permissions('curriculum.view')
  learningAreas(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'learningAreas');
  }

  @Post('curriculum/learning-areas')
  @Permissions('curriculum.manage')
  createLearningArea(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'learningAreas', body);
  }

  @Get('curriculum/learner-competencies')
  @Permissions('curriculum.view')
  learnerCompetencies(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'learnerCompetencies');
  }

  @Post('curriculum/learner-competencies')
  @Permissions('curriculum.manage')
  createLearnerCompetency(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'learnerCompetencies', body);
  }

  @Get('lms/courses')
  @Permissions('lms.view')
  courses(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'courses');
  }

  @Post('lms/courses')
  @Permissions('lms.manage')
  createCourse(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'courses', body);
  }

  @Get('hr/employees')
  @Permissions('hr.view')
  employees(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'employees');
  }

  @Post('hr/employees')
  @Permissions('hr.manage')
  createEmployee(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'employees', body);
  }

  @Get('inventory/items')
  @Permissions('inventory.view')
  inventoryItems(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'inventoryItems');
  }

  @Post('inventory/items')
  @Permissions('inventory.manage')
  createInventoryItem(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'inventoryItems', body);
  }

  @Get('inventory/assets')
  @Permissions('inventory.view')
  assets(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'assets');
  }

  @Post('inventory/assets')
  @Permissions('inventory.manage')
  createAsset(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'assets', body);
  }

  @Get('procurement/suppliers')
  @Permissions('procurement.view')
  suppliers(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'suppliers');
  }

  @Post('procurement/suppliers')
  @Permissions('procurement.manage')
  createSupplier(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'suppliers', body);
  }

  @Get('procurement/requests')
  @Permissions('procurement.view')
  purchaseRequests(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'purchaseRequests');
  }

  @Post('procurement/requests')
  @Permissions('procurement.manage')
  createPurchaseRequest(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'purchaseRequests', body);
  }

  @Get('library/books')
  @Permissions('library.view')
  libraryBooks(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'libraryBooks');
  }

  @Post('library/books')
  @Permissions('library.manage')
  createLibraryBook(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'libraryBooks', body);
  }

  @Get('boarding/dormitories')
  @Permissions('boarding.view')
  dormitories(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'dormitories');
  }

  @Post('boarding/dormitories')
  @Permissions('boarding.manage')
  createDormitory(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'dormitories', body);
  }

  @Get('transport/vehicles')
  @Permissions('transport.view')
  vehicles(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'vehicles');
  }

  @Post('transport/vehicles')
  @Permissions('transport.manage')
  createVehicle(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'vehicles', body);
  }

  @Get('transport/routes')
  @Permissions('transport.view')
  routes(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'transportRoutes');
  }

  @Post('transport/routes')
  @Permissions('transport.manage')
  createRoute(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'transportRoutes', body);
  }

  @Get('communication/templates')
  @Permissions('communication.send')
  templates(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'messageTemplates');
  }

  @Post('communication/templates')
  @Permissions('communication.send')
  createTemplate(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'messageTemplates', body);
  }

  @Get('analytics/snapshots')
  @Permissions('analytics.view')
  analyticsSnapshots(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'analyticsSnapshots');
  }

  @Post('analytics/snapshots')
  @Permissions('analytics.manage')
  createAnalyticsSnapshot(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'analyticsSnapshots', body);
  }

  @Get('integrations/government-submissions')
  @Permissions('integrations.view')
  governmentSubmissions(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'governmentSubmissions');
  }

  @Post('integrations/government-submissions')
  @Permissions('integrations.manage')
  createGovernmentSubmission(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'governmentSubmissions', body);
  }

  @Get('integrations/national-exam-candidates')
  @Permissions('integrations.view')
  nationalExamCandidates(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'nationalExamCandidates');
  }

  @Post('integrations/national-exam-candidates')
  @Permissions('integrations.manage')
  createNationalExamCandidate(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'nationalExamCandidates', body);
  }

  @Get('countries/configs')
  @Permissions('country.manage')
  countryConfigs(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'countryConfigs');
  }

  @Post('countries/configs')
  @Permissions('country.manage')
  createCountryConfig(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'countryConfigs', body);
  }

  @Get('ai/jobs')
  @Permissions('ai.view')
  aiJobs(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'aiJobs');
  }

  @Post('ai/jobs')
  @Permissions('ai.create')
  createAiJob(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'aiJobs', body);
  }

  @Get('discipline/cases')
  @Permissions('discipline.view')
  disciplineCases(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'disciplineCases');
  }

  @Post('discipline/cases')
  @Permissions('discipline.manage')
  createDisciplineCase(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'disciplineCases', body);
  }

  @Get('discipline/counseling-notes')
  @Permissions('discipline.view')
  counselingNotes(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'counselingNotes');
  }

  @Post('discipline/counseling-notes')
  @Permissions('discipline.manage')
  createCounselingNote(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'counselingNotes', body);
  }

  @Get('events')
  @Permissions('events.view')
  events(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'events');
  }

  @Post('events')
  @Permissions('events.manage')
  createEvent(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'events', body);
  }

  @Get('events/attendance')
  @Permissions('events.view')
  eventAttendances(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'eventAttendances');
  }

  @Post('events/attendance')
  @Permissions('events.manage')
  createEventAttendance(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'eventAttendances', body);
  }

  @Get('infrastructure/buildings')
  @Permissions('infrastructure.view')
  buildings(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'buildings');
  }

  @Post('infrastructure/buildings')
  @Permissions('infrastructure.manage')
  createBuilding(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'buildings', body);
  }

  @Get('infrastructure/classrooms')
  @Permissions('infrastructure.view')
  classrooms(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'classrooms');
  }

  @Post('infrastructure/classrooms')
  @Permissions('infrastructure.manage')
  createClassroom(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'classrooms', body);
  }

  @Get('infrastructure/facilities')
  @Permissions('infrastructure.view')
  facilities(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'facilities');
  }

  @Post('infrastructure/facilities')
  @Permissions('infrastructure.manage')
  createFacility(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'facilities', body);
  }

  @Get('infrastructure/maintenance-records')
  @Permissions('infrastructure.view')
  maintenanceRecords(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'maintenanceRecords');
  }

  @Post('infrastructure/maintenance-records')
  @Permissions('infrastructure.manage')
  createMaintenanceRecord(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'maintenanceRecords', body);
  }

  @Get('inspections/templates')
  @Permissions('inspections.view')
  inspectionTemplates(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'inspectionTemplates');
  }

  @Post('inspections/templates')
  @Permissions('inspections.manage')
  createInspectionTemplate(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'inspectionTemplates', body);
  }

  @Get('inspections')
  @Permissions('inspections.view')
  inspections(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'inspections');
  }

  @Post('inspections')
  @Permissions('inspections.manage')
  createInspection(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'inspections', body);
  }

  @Get('inspections/compliance-actions')
  @Permissions('inspections.view')
  complianceActions(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'complianceActions');
  }

  @Post('inspections/compliance-actions')
  @Permissions('inspections.manage')
  createComplianceAction(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'complianceActions', body);
  }

  @Get('gis/regions')
  @Permissions('gis.view')
  geoRegions(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'geoRegions');
  }

  @Post('gis/regions')
  @Permissions('gis.manage')
  createGeoRegion(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'geoRegions', body);
  }

  @Get('gis/locations')
  @Permissions('gis.view')
  locations(@CurrentUser() user: AuthUser) {
    return this.enterpriseService.list(user, 'locations');
  }

  @Post('gis/locations')
  @Permissions('gis.manage')
  createLocation(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.enterpriseService.create(user, 'locations', body);
  }
}
