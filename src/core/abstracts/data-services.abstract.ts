
import { OrderRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/order.repository';
import { IGenericRepository } from './generic-repository.abstract';
import { Cart } from 'src/frameworks/data-services/mongo/entities/cart.model';

export abstract class IDataServices {
  abstract orders: OrderRepositoryImpl;
  abstract carts: IGenericRepository<Cart>;
}
