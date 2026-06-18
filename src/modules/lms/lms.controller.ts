import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { LmsService } from './lms.service';

@Controller('lms')
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  @Get('courses')
  @Permissions('lms.view')
  findCourses(@CurrentUser() user: AuthUser) {
    return this.lmsService.findCourses(user);
  }

  @Post('courses')
  @Permissions('lms.create')
  createCourse(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.lmsService.createCourse(user, body);
  }

  @Get('courses/:courseId/lessons')
  @Permissions('lms.view')
  findLessons(@CurrentUser() user: AuthUser, @Param('courseId') courseId: string) {
    return this.lmsService.findLessons(user, courseId);
  }

  @Post('courses/:courseId/lessons')
  @Permissions('lms.create')
  createLesson(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() body: any,
  ) {
    return this.lmsService.createLesson(user, courseId, body);
  }
}
