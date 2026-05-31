import { IsNumber, IsString, Max, Min } from 'class-validator';

export class EnterMarkDto {
  @IsString()
  examId: string;

  @IsString()
  studentId: string;

  @IsString()
  subjectId: string;

  @IsNumber()
  @Min(0)
  @Max(1000)
  score: number;
}
