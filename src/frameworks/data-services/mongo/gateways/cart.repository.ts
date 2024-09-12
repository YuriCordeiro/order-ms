import mongoose from 'mongoose';
import { Cart } from '../entities/cart.model';
import { MongoGenericRepository } from '../external/mongo-generic-repository';

export class CartRepositoryImpl extends MongoGenericRepository<Cart> {

  getByTransationId(transactionId: string): Promise<Cart> {
    return this._repository.findOne({
      paymentTransaction: transactionId
    }).exec();
  }

}
