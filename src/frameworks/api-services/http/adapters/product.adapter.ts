import { HttpService } from "@nestjs/axios";
import { IProductPort } from "../ports/product.port";
import { AxiosResponse } from "axios";
import { Product } from "src/frameworks/data-services/mongo/entities/product.model";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ProductAdapter implements IProductPort {

    constructor(private readonly httpService: HttpService) { }
    getProductById(productId: string): Promise<AxiosResponse<Product>> {
        const finalUrl = `http://ad0c9e21ad37e4a10b59821579d5fd35-257402751.us-east-1.elb.amazonaws.com/products/id/${productId}`;

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
        const finalUrl = `http://ad0c9e21ad37e4a10b59821579d5fd35-257402751.us-east-1.elb.amazonaws.com/product/sku/${productSKU}`;

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