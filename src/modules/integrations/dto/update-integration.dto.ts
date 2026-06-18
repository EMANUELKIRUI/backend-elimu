import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class UpdateIntegrationDto {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  baseUrl?: string;

  @IsOptional()
  config?: Prisma.InputJsonValue;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
