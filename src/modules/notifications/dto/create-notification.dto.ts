import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateNotificationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  data?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  status?: string;
}
