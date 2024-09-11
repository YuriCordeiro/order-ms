import { ObjectId } from "mongoose";
import { PaymentMethod } from "./payment.model";

export class Transaction {
  _id: string;
  paymentMethod: PaymentMethod;
  status: string;
  total: number;
}
