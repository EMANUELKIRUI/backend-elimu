import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { AuthUser } from '../../common/types/auth-user';
import { AttendanceService } from './attendance.service';
import { RecordStaffAttendanceDto } from './dto/record-staff-attendance.dto';
import { RecordStudentAttendanceDto } from './dto/record-student-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('students')
  @Permissions('attendance.view')
  findStudentAttendance(@CurrentUser() user: AuthUser, @Query('date') date?: string) {
    return this.attendanceService.findStudentAttendance(user, date);
  }

  @Post('students')
  @Permissions('attendance.create')
  recordStudentAttendance(
    @CurrentUser() user: AuthUser,
    @Body() dto: RecordStudentAttendanceDto,
  ) {
    return this.attendanceService.recordStudentAttendance(user, dto);
  }

  @Get('staff')
  @Permissions('attendance.view')
  findStaffAttendance(@CurrentUser() user: AuthUser, @Query('date') date?: string) {
    return this.attendanceService.findStaffAttendance(user, date);
  }

  @Post('staff')
  @Permissions('attendance.create')
  recordStaffAttendance(
    @CurrentUser() user: AuthUser,
    @Body() dto: RecordStaffAttendanceDto,
  ) {
    return this.attendanceService.recordStaffAttendance(user, dto);
  }
}
