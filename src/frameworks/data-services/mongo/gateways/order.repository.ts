import { Order } from '../entities/order.model';
import { MongoGenericRepository } from '../external/mongo-generic-repository';

export class OrderRepositoryImpl extends MongoGenericRepository<Order> {

  getOrderByStatus(status: string) {
    return this._repository
      .find({ status: status })
      .exec();
  }

}
