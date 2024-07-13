import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { IGenericRepository } from 'src/core/abstracts/generic-repository.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from './external/mongo-generic-repository';
import { OrderRepositoryImpl } from './gateways/order.repository';
import { Order, OrderDocument } from './entities/order.model';
import { Cart, CartDocument } from './entities/cart.model';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap {
  orders: OrderRepositoryImpl;
  carts: IGenericRepository<Cart>;

  constructor(
    @InjectModel(Order.name)
    private OrderRepository: Model<OrderDocument>,
    @InjectModel(Cart.name)
    private CartRepository: Model<CartDocument>,
  ) { }

  onApplicationBootstrap() {
    this.orders = new OrderRepositoryImpl(this.OrderRepository);
    this.carts = new MongoGenericRepository(this.CartRepository);
  }
}
