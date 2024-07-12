import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart/cart.controller';
import { CartUseCaseModule } from './use-cases/cart/cart.use-cases.module';

@Module({
  imports: [CartUseCaseModule],
  controllers: [CartController],
  providers: [],
})
export class AppModule { }
