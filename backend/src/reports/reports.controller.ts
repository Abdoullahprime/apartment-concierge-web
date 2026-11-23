import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums.js';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('summary')
  summary(@Query('days') days?: string) {
    return this.reportsService.summary(days ? parseInt(days) : 30);
  }

  @Get('occupancy')
  occupancy(@Query('days') days?: string) {
    return this.reportsService.occupancyOverTime(days ? parseInt(days) : 30);
  }

  @Get('bookings-by-category')
  byCategory(@Query('days') days?: string) {
    return this.reportsService.bookingsByCategory(days ? parseInt(days) : 30);
  }

  @Get('status-breakdown')
  statusBreakdown(@Query('days') days?: string) {
    return this.reportsService.statusBreakdown(days ? parseInt(days) : 30);
  }
}
