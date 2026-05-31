import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  county?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
