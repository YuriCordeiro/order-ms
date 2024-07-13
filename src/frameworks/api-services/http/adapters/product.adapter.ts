import { HttpService } from "@nestjs/axios";
import { ProductPort } from "../ports/product.port";
import { AxiosResponse } from "axios";
import { Product } from "src/frameworks/data-services/mongo/entities/product.model";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductAdapter implements ProductPort {

    constructor(private readonly httpService: HttpService) { }
    getProductById(productId: string): Promise<AxiosResponse<Product>> {
        const localURL = `http://0.0.0.0:3000/products/id/${productId}`;
        const containerURL = `http://product_ms:3000/products/id/${productId}`;

        return this.httpService.
            axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

    getProductBySKU(productSKU: string) {
        const localURL = `http://0.0.0.0:3000/product/sku/${productSKU}`;
        const containerURL = `http://customer_ms:3000/product/sku/${productSKU}`;

        return this.httpService.axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

}