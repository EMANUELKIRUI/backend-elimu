import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  admissionNumber: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsString()
  streamId?: string;
}
