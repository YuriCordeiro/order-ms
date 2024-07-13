import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from './product.model';
import { Customer } from './customer.model';
import { Transaction } from './transaction.model';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop()
  products: Product[];
  @Prop()
  paymentTransaction: Transaction;
  @Prop()
  status: string;
  @Prop()
  value: number;
  @Prop()
  customer: Customer;
  @Prop()
  queuePosition: number;
  @Prop({ type: Date })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
