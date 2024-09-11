import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from './product.model';
import { Customer } from './customer.model';
import { Transaction } from './transaction.model'
import mongoose, { ObjectId } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  // @Prop({type: mongoose.SchemaTypes.ObjectId})
  _id: string;
  @Prop()
  products: Product[];
  @Prop({
    // type: mongoose.Schema.ObjectId, ref: Transaction.name
  })
  paymentTransaction: Transaction;
  @Prop()
  total: number;
  @Prop()
  customer: Customer;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
