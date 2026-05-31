import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { CreateSchoolDto } from './dto/create-school.dto';
import { SchoolsService } from './schools.service';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @Permissions('schools.create')
  create(@Body() dto: CreateSchoolDto) {
    return this.schoolsService.create(dto);
  }

  @Get('me')
  @Permissions('schools.view')
  getCurrentSchool(@CurrentUser() user: AuthUser) {
    return this.schoolsService.findOneForUser(user);
  }

  @Post('settings')
  @Permissions('schools.configure')
  upsertSetting(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.schoolsService.upsertSetting(user, body);
  }

  @Post('academic-years')
  @Permissions('schools.configure')
  createAcademicYear(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.schoolsService.createAcademicYear(user, body);
  }

  @Post('terms')
  @Permissions('schools.configure')
  createTerm(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.schoolsService.createTerm(user, body);
  }

  @Post('departments')
  @Permissions('schools.configure')
  createDepartment(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.schoolsService.createDepartment(user, body);
  }
}
