import { Injectable } from '@nestjs/common';
import { StaysService } from '../stays/stays.service.js';
import { BookingsService } from '../bookings/bookings.service.js';
import { BookingStatus } from '../common/enums.js';

@Injectable()
export class ReportsService {
  constructor(
    private staysService: StaysService,
    private bookingsService: BookingsService,
  ) {}

  async occupancyOverTime(days = 30) {
    return this.staysService.occupancyOverTime(days);
  }

  async bookingsByCategory(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.bookingsService.countByCategory(since.toISOString());
  }

  async statusBreakdown(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString();

    const statuses = [
      BookingStatus.PENDING,
      BookingStatus.CONFIRMED,
      BookingStatus.COMPLETED,
      BookingStatus.CANCELLED,
      BookingStatus.REJECTED,
    ];

    const counts = await Promise.all(
      statuses.map(async (status) => {
        const bookings = await this.bookingsService.findAll({ status });
        const inWindow = bookings.filter(
          (b: any) => b.created_at >= sinceStr,
        ).length;
        return { status, count: inWindow };
      }),
    );

    return counts;
  }

  async summary(days = 30) {
    const [occupancy, byCategory, byStatus] = await Promise.all([
      this.occupancyOverTime(days),
      this.bookingsByCategory(days),
      this.statusBreakdown(days),
    ]);

    return { occupancy, byCategory, byStatus, days };
  }
}
