import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TenantType } from '@prisma/client';

export class CreateTenantDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsEnum(TenantType)
  type: TenantType;

  @IsOptional()
  @IsString()
  status?: string;
}
