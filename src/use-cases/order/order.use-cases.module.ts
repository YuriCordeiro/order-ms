import { Module } from '@nestjs/common';
import { DataServicesModule } from 'src/services/data-services.module';
import { OrderFactoryService } from './order-factory.service';
import { OrderUseCases } from './order.use-case';
import { SQSProducerService } from 'src/frameworks/messaging-services/sqs-messaging-services.service';

@Module({
  imports: [
    DataServicesModule
  ],
  providers: [OrderFactoryService, OrderUseCases, SQSProducerService],
  exports: [OrderFactoryService, OrderUseCases, SQSProducerService],
})
export class OrderUseCaseModule { }
