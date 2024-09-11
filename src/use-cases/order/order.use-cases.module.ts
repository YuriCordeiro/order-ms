import { Module } from '@nestjs/common';
import { DataServicesModule } from 'src/services/data-services.module';
import { OrderFactoryService } from './order-factory.service';
import { OrderUseCases } from './order.use-case';
import { SQSProducerService } from 'src/frameworks/messaging-services/sqs-messaging-services.service';
import { MessageHandler } from 'src/frameworks/messaging-services/sqs-message-handler';
import { CartUseCases } from '../cart/cart.use-case';
import { CartFactoryService } from '../cart/cart-factory.service';
import { ProductAdapter } from 'src/frameworks/api-services/http/adapters/product.adapter';
import { CustomerAdapter } from 'src/frameworks/api-services/http/adapters/customer.adapter';
import { TransactionAdapter } from 'src/frameworks/api-services/http/adapters/transaction.adapter';
import { ITransactionPortToken } from 'src/frameworks/api-services/http/ports/transaction.port';
import { ICustomerPortToken } from 'src/frameworks/api-services/http/ports/customer.port';
import { IProductPortToken } from 'src/frameworks/api-services/http/ports/product.port';
import { HttpModule } from '@nestjs/axios';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs'

@Module({
  imports: [
    DataServicesModule,
    HttpModule,
    SqsModule.register({
      consumers: [
          {
              name: process.env.SQS_QUEUE_NAME, // name of the queue 
              queueUrl: process.env.SQS_URL, // the url of the queue
              region: process.env.SQS_REGION,
              waitTimeSeconds: 20,
              sqs: new SQSClient({
                region: process.env.SQS_REGION,
                credentials: {
                  accessKeyId: process.env.SQS_ACCESS_KEY_ID,
                  secretAccessKey: process.env.SQS_SECRET_ACCESS_KEY
                }
              })
          },
      ],
      producers: []
  })
  ],
  providers: [OrderFactoryService, OrderUseCases, SQSProducerService, MessageHandler, CartUseCases, CartFactoryService,
    { provide: IProductPortToken, useClass: ProductAdapter },
        { provide: ICustomerPortToken, useClass: CustomerAdapter },
        { provide: ITransactionPortToken, useClass: TransactionAdapter },
  ],
  exports: [OrderFactoryService, OrderUseCases, SQSProducerService, MessageHandler, CartUseCases, CartFactoryService],
})
export class OrderUseCaseModule { }
