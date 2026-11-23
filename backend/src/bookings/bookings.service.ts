import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BookingStatus, Role } from '../common/enums.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.REJECTED]: [],
};

@Injectable()
export class BookingsService {
  private supabase: SupabaseClient;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL')!,
      config.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  async findAll(filters: {
    status?: BookingStatus;
    date?: string;
    userId?: string;
    limit?: number;
  }) {
    let query = this.supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.date) query = query.eq('date', filters.date);
    if (filters.userId) query = query.eq('user_id', filters.userId);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new NotFoundException('Booking not found');
    return data;
  }

  async create(dto: CreateBookingDto, userId: string) {
    // Fetch service to copy name + category at time of booking
    const { data: service } = await this.supabase
      .from('services')
      .select('id, name, category, active')
      .eq('id', dto.serviceId)
      .single();

    if (!service || !service.active) {
      throw new BadRequestException('Service is not available');
    }

    // Fetch user name to denormalise onto booking
    const { data: user } = await this.supabase
      .from('users')
      .select('name')
      .eq('id', userId)
      .single();

    const { data, error } = await this.supabase
      .from('bookings')
      .insert({
        user_id: userId,
        user_name: user?.name ?? 'Unknown',
        service_id: dto.serviceId,
        service_name: service.name,
        category: service.category,
        date: dto.date,
        time: dto.time,
        notes: dto.notes,
        quantity: dto.quantity ?? 1,
        status: BookingStatus.PENDING,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async updateStatus(
    id: string,
    newStatus: BookingStatus,
    agentId: string,
    requesterRole: Role,
  ) {
    const booking = await this.findOne(id);
    const current: BookingStatus = booking.status;

    // Only agents/admins can confirm, reject, complete
    const staffOnly: BookingStatus[] = [
      BookingStatus.CONFIRMED, BookingStatus.REJECTED, BookingStatus.COMPLETED,
    ];
    if (staffOnly.includes(newStatus) && requesterRole === Role.RESIDENT || requesterRole === Role.GUEST) {
      throw new ForbiddenException('Only staff can change this status');
    }

    if (!ALLOWED_TRANSITIONS[current].includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${current} to ${newStatus}`,
      );
    }

    const { data, error } = await this.supabase
      .from('bookings')
      .update({
        status: newStatus,
        handled_by: agentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async countByCategory(since: string) {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('category')
      .gte('created_at', since);
    if (error) throw new Error(error.message);

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      counts[row.category] = (counts[row.category] ?? 0) + 1;
    }
    return counts;
  }
}
