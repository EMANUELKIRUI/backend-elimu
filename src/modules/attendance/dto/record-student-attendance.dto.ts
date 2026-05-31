import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

const statuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const;

export class RecordStudentAttendanceDto {
  @IsString()
  studentId: string;

  @IsDateString()
  date: string;

  @IsIn(statuses)
  status: (typeof statuses)[number];

  @IsOptional()
  @IsString()
  notes?: string;
}
