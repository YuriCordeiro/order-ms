import { Module } from '@nestjs/common';
import { DataServicesModule } from 'src/services/data-services.module';
import { OrderFactoryService } from './order-factory.service';
import { OrderUseCases } from './order.use-case';

@Module({
  imports: [
    DataServicesModule
  ],
  providers: [OrderFactoryService, OrderUseCases],
  exports: [OrderFactoryService, OrderUseCases],
})
export class OrderUseCaseModule { }
