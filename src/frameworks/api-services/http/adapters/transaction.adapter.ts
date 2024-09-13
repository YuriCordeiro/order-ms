import { Transaction } from "src/frameworks/data-services/mongo/entities/transaction.model";
import { ITransactionPort } from "../ports/transaction.port";
import { AxiosResponse } from "axios";
import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class TransactionAdapter implements ITransactionPort {

    constructor(private readonly httpService: HttpService) { }

    getTransactionById(transactionId: string): Promise<AxiosResponse<Transaction>> {
        // const localURL = `http://0.0.0.0:3003/transactions/${transactionId}`;
        // const containerURL = `http://payment_ms:3003/transactions/${transactionId}`;
        
        const finalUrl = `http://a182a7d14d5234bdc91b6be1016937b9-1733100013.us-east-1.elb.amazonaws.com/transactions/${transactionId}`;
        
        return this.httpService.axiosRef.get(finalUrl, {
            headers: { 'Content-Type': 'application/json' },
            proxy: false
        })
        .then((response) => {
            Logger.log(`Response from ${finalUrl}`);
            Logger.log(response.data);
            return response;
        })
        .catch((error) => {
            Logger.error(`Error from ${finalUrl}`);
            if (error.response) {
                Logger.error(`Error status: ${error.response.status}`);
                Logger.error(`Error data: ${JSON.stringify(error.response.data)}`);
            } else {
                Logger.error(`Error message: ${error.message}`);
            }
            return null;
        });
    }

}