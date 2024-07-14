import { AxiosResponse } from "axios";
import { Transaction } from "src/frameworks/data-services/mongo/entities/transaction.model";

export interface ITransactionPort {

    getTransactionById(transactionId: string): Promise<AxiosResponse<Transaction>>;
}

export const ITransactionPortToken = Symbol("ITransactionPort");