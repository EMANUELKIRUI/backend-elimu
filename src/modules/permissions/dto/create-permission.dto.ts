import { IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  action: string;

  @IsString()
  description: string;
}
