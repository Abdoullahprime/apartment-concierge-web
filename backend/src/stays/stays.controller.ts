import { Controller, Post, Get, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StaysService } from './stays.service.js';
import { CheckInDto } from './dto/check-in.dto.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums.js';

@Controller('stays')
@UseGuards(AuthGuard('jwt'))
export class StaysController {
  constructor(private staysService: StaysService) {}

  @Post('checkin')
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  checkIn(@Body() dto: CheckInDto) {
    return this.staysService.checkIn(
      dto.userId,
      dto.unitNumber,
      dto.checkInDate,
      dto.expectedCheckOut,
    );
  }

  @Post('checkout')
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  checkOut(@Body('userId') userId: string) {
    return this.staysService.checkOut(userId);
  }

  @Get('history')
  getHistory(@Request() req: any, @Query('userId') userId?: string) {
    // Agents/admins can query any user; residents/guests only their own
    const targetId =
      req.user.role === Role.AGENT || req.user.role === Role.ADMIN
        ? (userId ?? req.user.id)
        : req.user.id;
    return this.staysService.getHistory(targetId);
  }

  @Get('occupancy-over-time')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  occupancyOverTime(@Query('days') days?: string) {
    return this.staysService.occupancyOverTime(days ? parseInt(days) : 30);
  }
}
