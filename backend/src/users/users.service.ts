import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  private supabase: SupabaseClient;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL')!,
      config.get<string>('SUPABASE_SERVICE_KEY')!,
    );
  }

  async findByEmail(email: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error) return null;
    return data;
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, name, email, phone, role, unit_number, check_in_date, employee_id')
      .eq('id', id)
      .single();
    if (error) throw new NotFoundException('User not found');
    return data;
  }

  async findAll(role?: Role) {
    let query = this.supabase
      .from('users')
      .select('id, name, email, phone, role, unit_number, check_in_date, employee_id');
    if (role) query = query.eq('role', role);
    const { data, error } = await query.order('name');
    if (error) throw new Error(error.message);
    return data;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { data, error } = await this.supabase
      .from('users')
      .insert({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        role: dto.role,
        password_hash: passwordHash,
        unit_number: dto.unitNumber,
        employee_id: dto.employeeId,
      })
      .select('id, name, email, phone, role, unit_number, employee_id')
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.from('users').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
}
