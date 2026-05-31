import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  monthlyFee?: number;

  @IsArray()
  @IsString({ each: true })
  modules: string[];
}
