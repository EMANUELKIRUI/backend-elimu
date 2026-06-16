import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TenantType } from '@prisma/client';

export class CreateOrganizationDto {
  @IsUUID()
  tenantId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsString()
  name: string;

  @IsEnum(TenantType)
  type: TenantType;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  county?: string;

  @IsOptional()
  @IsString()
  district?: string;
}
