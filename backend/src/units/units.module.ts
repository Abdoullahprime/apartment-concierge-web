import { Module } from '@nestjs/common';
import { UnitsService } from './units.service.js';
import { UnitsController } from './units.controller.js';

@Module({
  providers: [UnitsService],
  controllers: [UnitsController],
  exports: [UnitsService],
})
export class UnitsModule {}
