import { IsEnum } from 'class-validator';
import { BookingStatus } from '../../common/enums.js';

export class UpdateStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
