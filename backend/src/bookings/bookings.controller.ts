import {
  Controller, Get, Post, Patch, Param, Body,
  Query, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { BookingStatus, Role } from '../common/enums.js';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query('status') status?: BookingStatus,
    @Query('date') date?: string,
    @Query('limit') limit?: string,
  ) {
    const user = req.user;
    // Residents/guests can only see their own bookings
    const userId =
      user.role === Role.RESIDENT || user.role === Role.GUEST
        ? user.id
        : undefined;

    return this.bookingsService.findAll({
      status,
      date,
      userId,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const booking = await this.bookingsService.findOne(id);
    const user = req.user;
    if (
      (user.role === Role.RESIDENT || user.role === Role.GUEST) &&
      booking.user_id !== user.id
    ) {
      throw new Error('Forbidden');
    }
    return booking;
  }

  @Post()
  create(@Body() dto: CreateBookingDto, @Request() req: any) {
    return this.bookingsService.create(dto, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Request() req: any,
  ) {
    return this.bookingsService.updateStatus(
      id,
      dto.status,
      req.user.id,
      req.user.role,
    );
  }
}
