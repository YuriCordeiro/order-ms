import { Transaction } from "src/frameworks/data-services/mongo/entities/transaction.model";
import { ITransactionPort } from "../ports/transaction.port";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransactionAdapter implements ITransactionPort {

    constructor(private readonly httpService: HttpService) { }

    getTransactionById(transactionId: string): Promise<AxiosResponse<Transaction>> {
        const localURL = `http://0.0.0.0:3003/transactions/${transactionId}`;
        const containerURL = `http://payment_ms:3003/transactions/${transactionId}`;

        return this.httpService.
            axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

}