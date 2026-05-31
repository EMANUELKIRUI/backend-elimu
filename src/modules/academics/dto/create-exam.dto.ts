import { IsString } from 'class-validator';

export class CreateExamDto {
  @IsString()
  academicYearId: string;

  @IsString()
  termId: string;

  @IsString()
  name: string;
}
