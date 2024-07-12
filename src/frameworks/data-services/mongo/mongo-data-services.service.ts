import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { IGenericRepository } from 'src/core/abstracts/generic-repository.abstract';
// import { Customer, CustomerDocument } from './entities/customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoGenericRepository } from './external/mongo-generic-repository';
//import { CustomerRepositoryImpl } from './gateways/customer.repository';
//import { OrderRepositoryImpl } from './gateways/order.repository';
//import { Product, ProductDocument } from './entities/product.model';
//import { Order, OrderDocument } from './entities/order.model';
// import { PaymentMethod, PaymentMethodDocument } from './entities/payment.model';
// import { ProductRepositoryImpl } from './gateways/product.repository';
import { Cart, CartDocument } from './entities/cart.model';
// import { Transaction, TransactionDocument } from './entities/transaction.model';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap {
  // customers: CustomerRepositoryImpl;
  // products: ProductRepositoryImpl;
  // orders: OrderRepositoryImpl;
  carts: IGenericRepository<Cart>;
  // payments: IGenericRepository<PaymentMethod>;
  // transactions: IGenericRepository<Transaction>;

  constructor(
    // @InjectModel(Customer.name)
    // private CustomerRepository: Model<CustomerDocument>,
    // @InjectModel(Product.name)
    // private ProductRepository: Model<ProductDocument>,
    // @InjectModel(Order.name)
    // private OrderRepository: Model<OrderDocument>,
    // @InjectModel(PaymentMethod.name)
    // private PaymentRepository: Model<PaymentMethodDocument>,
    @InjectModel(Cart.name)
    private CartRepository: Model<CartDocument>,
    // @InjectModel(Transaction.name)
    // private TransactionRepository: Model<TransactionDocument>
  ) { }

  onApplicationBootstrap() {
    // this.customers = new CustomerRepositoryImpl(this.CustomerRepository);
    // this.products = new ProductRepositoryImpl(this.ProductRepository);
    // this.orders = new OrderRepositoryImpl(this.OrderRepository);
    // this.payments = new MongoGenericRepository(this.PaymentRepository);
    this.carts = new MongoGenericRepository(this.CartRepository);
    // this.transactions = new MongoGenericRepository(this.TransactionRepository);
  }
}
