import { Module } from '@nestjs/common';
import { StaysService } from './stays.service.js';
import { StaysController } from './stays.controller.js';
import { UnitsModule } from '../units/units.module.js';

@Module({
  imports: [UnitsModule],
  providers: [StaysService],
  controllers: [StaysController],
  exports: [StaysService],
})
export class StaysModule {}
