import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UnitsService {
  private supabase: SupabaseClient;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL')!,
      config.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('units')
      .select('number, occupant_id, users(id, name, email, role)')
      .order('number');
    if (error) throw new Error(error.message);
    return data;
  }

  async findFree() {
    const { data, error } = await this.supabase
      .from('units')
      .select('number')
      .is('occupant_id', null)
      .order('number');
    if (error) throw new Error(error.message);
    return data;
  }

  async assign(unitNumber: number, occupantId: string) {
    const { data: unit } = await this.supabase
      .from('units')
      .select('occupant_id')
      .eq('number', unitNumber)
      .single();

    if (!unit) throw new NotFoundException(`Unit ${unitNumber} not found`);
    if (unit.occupant_id) {
      throw new ConflictException(`Unit ${unitNumber} is already occupied`);
    }

    const { error } = await this.supabase
      .from('units')
      .update({ occupant_id: occupantId })
      .eq('number', unitNumber);
    if (error) throw new Error(error.message);
  }

  async release(unitNumber: number) {
    const { error } = await this.supabase
      .from('units')
      .update({ occupant_id: null })
      .eq('number', unitNumber);
    if (error) throw new Error(error.message);
  }

  async occupancyCount() {
    const { count } = await this.supabase
      .from('units')
      .select('*', { count: 'exact', head: true })
      .not('occupant_id', 'is', null);
    return { occupied: count ?? 0, total: 17, free: 17 - (count ?? 0) };
  }
}
