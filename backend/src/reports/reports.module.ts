import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { ReportsController } from './reports.controller.js';
import { StaysModule } from '../stays/stays.module.js';
import { BookingsModule } from '../bookings/bookings.module.js';

@Module({
  imports: [StaysModule, BookingsModule],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
