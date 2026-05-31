import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RecordPaymentDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsString()
  invoiceId?: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
