import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { AcademicsService } from './academics.service';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { EnterMarkDto } from './dto/enter-mark.dto';

@Controller('academics')
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Get('classes')
  @Permissions('academics.view')
  findClasses(@CurrentUser() user: AuthUser) {
    return this.academicsService.findClasses(user);
  }

  @Post('classes')
  @Permissions('academics.configure')
  createClass(@CurrentUser() user: AuthUser, @Body() dto: CreateClassDto) {
    return this.academicsService.createClass(user, dto);
  }

  @Get('subjects')
  @Permissions('academics.view')
  findSubjects(@CurrentUser() user: AuthUser) {
    return this.academicsService.findSubjects(user);
  }

  @Post('subjects')
  @Permissions('academics.configure')
  createSubject(@CurrentUser() user: AuthUser, @Body() dto: CreateSubjectDto) {
    return this.academicsService.createSubject(user, dto);
  }

  @Post('exams')
  @Permissions('exams.create')
  createExam(@CurrentUser() user: AuthUser, @Body() dto: CreateExamDto) {
    return this.academicsService.createExam(user, dto);
  }

  @Post('marks')
  @Permissions('marks.create')
  enterMark(@CurrentUser() user: AuthUser, @Body() dto: EnterMarkDto) {
    return this.academicsService.enterMark(user, dto);
  }

  @Get('exams/:examId/marksheet')
  @Permissions('marks.view')
  getMarksheet(@CurrentUser() user: AuthUser, @Param('examId') examId: string) {
    return this.academicsService.getMarksheet(user, examId);
  }

  @Patch('exams/:examId/submit')
  @Permissions('marks.submit')
  submitExam(@CurrentUser() user: AuthUser, @Param('examId') examId: string) {
    return this.academicsService.updateExamStatus(user, examId, 'SUBMITTED');
  }

  @Patch('exams/:examId/approve')
  @Permissions('marks.approve')
  approveExam(@CurrentUser() user: AuthUser, @Param('examId') examId: string) {
    return this.academicsService.updateExamStatus(user, examId, 'APPROVED');
  }

  @Patch('exams/:examId/lock')
  @Permissions('marks.lock')
  lockExam(@CurrentUser() user: AuthUser, @Param('examId') examId: string) {
    return this.academicsService.updateExamStatus(user, examId, 'LOCKED');
  }
}
