import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceCategory } from '../../common/enums.js';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsString()
  @IsOptional()
  contact?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean = true;
}
