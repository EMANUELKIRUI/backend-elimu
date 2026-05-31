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
}
