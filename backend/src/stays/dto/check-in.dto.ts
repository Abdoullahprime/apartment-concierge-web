import { IsDateString, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class CheckInDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(1)
  @Max(17)
  unitNumber: number;

  @IsDateString()
  checkInDate: string;

  @IsDateString()
  @IsOptional()
  expectedCheckOut?: string;
}
