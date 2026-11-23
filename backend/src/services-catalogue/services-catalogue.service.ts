import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ServiceCategory } from '../common/enums.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

@Injectable()
export class ServicesCatalogueService {
  private supabase: SupabaseClient;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL')!,
      config.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  async findAll(activeOnly = false, category?: ServiceCategory) {
    let query = this.supabase.from('services').select('*').order('name');
    if (activeOnly) query = query.eq('active', true);
    if (category) query = query.eq('category', category);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new NotFoundException('Service not found');
    return data;
  }

  async create(dto: CreateServiceDto) {
    const { data, error } = await this.supabase
      .from('services')
      .insert(dto)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const { data, error } = await this.supabase
      .from('services')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new NotFoundException('Service not found');
    return data;
  }

  async setActive(id: string, active: boolean) {
    return this.update(id, { active } as UpdateServiceDto);
  }

  async remove(id: string) {
    // Block delete if active bookings reference this service
    const { count } = await this.supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('service_id', id)
      .in('status', ['pending', 'confirmed']);
    if ((count ?? 0) > 0) {
      throw new Error('Cannot delete a service with active bookings. Deactivate it instead.');
    }
    const { error } = await this.supabase.from('services').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
