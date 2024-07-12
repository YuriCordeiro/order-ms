
import { IGenericRepository } from './generic-repository.abstract';
// import { ProductRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/product.repository';
import { Cart } from 'src/frameworks/data-services/mongo/entities/cart.model';

export abstract class IDataServices {
  // abstract products: ProductRepositoryImpl;
  abstract carts: IGenericRepository<Cart>;
}
