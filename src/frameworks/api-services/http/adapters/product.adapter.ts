import { HttpService } from "@nestjs/axios";
import { IProductPort } from "../ports/product.port";
import { AxiosResponse } from "axios";
import { Product } from "src/frameworks/data-services/mongo/entities/product.model";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ProductAdapter implements IProductPort {

    constructor(private readonly httpService: HttpService) { }
    getProductById(productId: string): Promise<AxiosResponse<Product>> {
        // const localURL = `http://0.0.0.0:3000/products/id/${productId}`;
        // const containerURL = `http://product_ms:3000/products/id/${productId}`;

        const finalUrl = `http://a381c6854c88c4b7193f320045e90215-127696975.us-east-1.elb.amazonaws.com/products/id/${productId}`;

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

    getProductBySKU(productSKU: string) {
        // const localURL = `http://0.0.0.0:3000/product/sku/${productSKU}`;
        // const containerURL = `http://customer_ms:3000/product/sku/${productSKU}`;
        const finalUrl = `http://a381c6854c88c4b7193f320045e90215-127696975.us-east-1.elb.amazonaws.com/product/sku/${productSKU}`;

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