import { IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class UpdateWorkflowDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  steps?: Prisma.InputJsonValue;
}
