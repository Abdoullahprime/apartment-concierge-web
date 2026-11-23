import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UnitsService } from '../units/units.service.js';

@Injectable()
export class StaysService {
  private supabase: SupabaseClient;

  constructor(
    private config: ConfigService,
    private unitsService: UnitsService,
  ) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL')!,
      config.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  async checkIn(userId: string, unitNumber: number, checkInDate: string, expectedCheckOut?: string) {
    // Guard: unit must be free (UnitsService throws ConflictException if occupied)
    await this.unitsService.assign(unitNumber, userId);

    // Update user record
    await this.supabase
      .from('users')
      .update({
        unit_number: unitNumber,
        check_in_date: checkInDate,
        expected_check_out: expectedCheckOut ?? null,
      })
      .eq('id', userId);

    return { unitNumber, checkInDate, expectedCheckOut };
  }

  async checkOut(userId: string) {
    const { data: user } = await this.supabase
      .from('users')
      .select('unit_number, check_in_date')
      .eq('id', userId)
      .single();

    if (!user?.unit_number) {
      throw new BadRequestException('User is not currently checked in');
    }

    const checkOutDate = new Date().toISOString().split('T')[0];

    // Write stay record
    await this.supabase.from('stay_records').insert({
      user_id: userId,
      unit_number: user.unit_number,
      check_in: user.check_in_date,
      check_out: checkOutDate,
    });

    // Release unit
    await this.unitsService.release(user.unit_number);

    // Clear user's unit
    await this.supabase
      .from('users')
      .update({ unit_number: null, check_in_date: null, expected_check_out: null })
      .eq('id', userId);

    return { unitNumber: user.unit_number, checkIn: user.check_in_date, checkOut: checkOutDate };
  }

  async getHistory(userId: string) {
    const { data, error } = await this.supabase
      .from('stay_records')
      .select('*')
      .eq('user_id', userId)
      .order('check_in', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  async occupancyOverTime(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await this.supabase
      .from('stay_records')
      .select('unit_number, check_in, check_out')
      .gte('check_in', since.toISOString().split('T')[0]);

    if (error) throw new Error(error.message);

    // Build a daily occupied-unit count for the last N days
    const result: { date: string; occupied: number }[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      const occupied = (data ?? []).filter(
        (s) => s.check_in <= dateStr && (!s.check_out || s.check_out >= dateStr),
      ).length;
      result.push({ date: dateStr, occupied });
    }
    return result;
  }
}
