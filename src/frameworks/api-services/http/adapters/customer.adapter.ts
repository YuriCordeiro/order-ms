import { Customer } from "src/frameworks/data-services/mongo/entities/customer.model";
import { ICustomerPort } from "../ports/customer.port";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerAdapter implements ICustomerPort {

    constructor(private readonly httpService: HttpService) { }

    getCustomerByID(customerId: string): Promise<AxiosResponse<Customer>> {
        const localURL = `http://0.0.0.0:3004/customers/id/${customerId}`;
        const containerURL = `http://customer_ms:3004/customers/id/${customerId}`;

        return this.httpService.axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

    getCustomerByCPF(customerCPF: string): Promise<AxiosResponse<Customer>> {
        const localURL = `http://0.0.0.0:3004/customers/cpf/${customerCPF}`;
        const containerURL = `http://customer_ms:3004/customers/cpf/${customerCPF}`;

        return this.httpService.axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

}