import { AxiosResponse } from "axios";
import { Customer } from "src/frameworks/data-services/mongo/entities/customer.model";

export interface CustomerPort {

    getCustomerByCPF(customerCPF: string): Promise<AxiosResponse<Customer>>;
    getCustomerByID(customerId: string): Promise<AxiosResponse<Customer>>;

}

export const ICustomerPortToken = Symbol("ICustomerPort");