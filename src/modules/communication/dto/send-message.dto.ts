import { IsArray, IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsIn(['sms', 'email'])
  channel: 'sms' | 'email';

  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @IsOptional()
  @IsEmail()
  fromEmail?: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;
}
