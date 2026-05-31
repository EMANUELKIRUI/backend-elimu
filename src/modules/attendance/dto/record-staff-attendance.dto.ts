import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

const statuses = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const;

export class RecordStaffAttendanceDto {
  @IsString()
  userId: string;

  @IsDateString()
  date: string;

  @IsIn(statuses)
  status: (typeof statuses)[number];

  @IsOptional()
  @IsString()
  notes?: string;
}
