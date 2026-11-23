import { Module } from '@nestjs/common';
import { ServicesCatalogueService } from './services-catalogue.service.js';
import { ServicesCatalogueController } from './services-catalogue.controller.js';

@Module({
  providers: [ServicesCatalogueService],
  controllers: [ServicesCatalogueController],
  exports: [ServicesCatalogueService],
})
export class ServicesCatalogueModule {}
