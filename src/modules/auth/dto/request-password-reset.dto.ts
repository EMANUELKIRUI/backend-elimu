import { IsString } from 'class-validator';

export class RequestPasswordResetDto {
  @IsString()
  identifier: string;
}
