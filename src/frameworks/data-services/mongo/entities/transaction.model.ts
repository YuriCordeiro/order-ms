import { PaymentMethod } from "./payment.model";

export class Transaction {
  paymentMethod: PaymentMethod;
  status: string;
  total: number;
}
