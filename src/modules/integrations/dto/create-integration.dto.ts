import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateIntegrationDto {
  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsString()
  country: string;

  @IsString()
  provider: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  baseUrl?: string;

  @IsOptional()
  config?: Prisma.InputJsonValue;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
