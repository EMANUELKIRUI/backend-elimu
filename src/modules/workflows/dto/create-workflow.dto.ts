import { IsArray, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateWorkflowDto {
  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  targetModule?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  steps?: Prisma.InputJsonValue;
}
