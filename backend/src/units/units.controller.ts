import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnitsService } from './units.service.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums.js';

@Controller('units')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UnitsController {
  constructor(private unitsService: UnitsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.AGENT)
  findAll() {
    return this.unitsService.findAll();
  }

  @Get('free')
  @Roles(Role.ADMIN, Role.AGENT)
  findFree() {
    return this.unitsService.findFree();
  }

  @Get('occupancy')
  @Roles(Role.ADMIN, Role.AGENT)
  occupancy() {
    return this.unitsService.occupancyCount();
  }
}
