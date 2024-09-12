import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartUseCaseModule } from './use-cases/cart/cart.use-cases.module';
import { OrderController } from './controllers/order.controller';
import { OrderUseCaseModule } from './use-cases/order/order.use-cases.module';
import { AppController } from './controllers/app.controller';
import { MessageHandler } from './frameworks/messaging-services/sqs-message-handler';

@Module({
  imports: [CartUseCaseModule, OrderUseCaseModule],
  controllers: [CartController, OrderController, AppController],
  providers: [],
})
export class AppModule { }
