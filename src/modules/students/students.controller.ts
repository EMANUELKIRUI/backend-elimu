import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @Permissions('students.view')
  findAll(@CurrentUser() user: AuthUser) {
    return this.studentsService.findAll(user);
  }

  @Post()
  @Permissions('students.create')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(user, dto);
  }

  @Post(':studentId/guardians')
  @Permissions('students.create')
  addGuardian(
    @CurrentUser() user: AuthUser,
    @Param('studentId') studentId: string,
    @Body() body: any,
  ) {
    return this.studentsService.addGuardian(user, studentId, body);
  }

  @Post(':studentId/documents')
  @Permissions('students.create')
  addDocument(
    @CurrentUser() user: AuthUser,
    @Param('studentId') studentId: string,
    @Body() body: any,
  ) {
    return this.studentsService.addDocument(user, studentId, body);
  }

  @Post(':studentId/medical-records')
  @Permissions('students.create')
  addMedicalRecord(
    @CurrentUser() user: AuthUser,
    @Param('studentId') studentId: string,
    @Body() body: any,
  ) {
    return this.studentsService.addMedicalRecord(user, studentId, body);
  }

  @Post(':studentId/transfers')
  @Permissions('students.create')
  transfer(
    @CurrentUser() user: AuthUser,
    @Param('studentId') studentId: string,
    @Body() body: any,
  ) {
    return this.studentsService.transfer(user, studentId, body);
  }
}
