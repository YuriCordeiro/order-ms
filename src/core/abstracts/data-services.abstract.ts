
import { OrderRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/order.repository';
import { IGenericRepository } from './generic-repository.abstract';
import { Cart } from 'src/frameworks/data-services/mongo/entities/cart.model';
import { CartRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/cart.repository';

export abstract class IDataServices {
  abstract orders: OrderRepositoryImpl;
  abstract carts: CartRepositoryImpl;
  // abstract carts: IGenericRepository<Cart>;
}
