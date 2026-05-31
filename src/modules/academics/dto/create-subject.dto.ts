import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum SubjectAssessmentModeDto {
  MARKS = 'MARKS',
  COMPETENCY = 'COMPETENCY',
}

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsEnum(SubjectAssessmentModeDto)
  mode: SubjectAssessmentModeDto;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  maxMarks?: number;
}
