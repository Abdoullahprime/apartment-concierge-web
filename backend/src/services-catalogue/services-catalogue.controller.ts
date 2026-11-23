import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ServicesCatalogueService } from './services-catalogue.service.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role, ServiceCategory } from '../common/enums.js';

@Controller('services')
export class ServicesCatalogueController {
  constructor(private catalogueService: ServicesCatalogueService) {}

  // Public: residents/guests browse active services
  @Get()
  findAll(
    @Query('activeOnly') activeOnly?: string,
    @Query('category') category?: ServiceCategory,
  ) {
    return this.catalogueService.findAll(activeOnly === 'true', category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogueService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateServiceDto) {
    return this.catalogueService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateServiceDto) {
    return this.catalogueService.update(id, dto);
  }

  @Patch(':id/active')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  setActive(@Param('id') id: string, @Body('active') active: boolean) {
    return this.catalogueService.setActive(id, active);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.catalogueService.remove(id);
  }
}
