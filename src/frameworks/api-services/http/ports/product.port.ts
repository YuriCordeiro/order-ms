import { AxiosResponse } from "axios";
import { Product } from "src/frameworks/data-services/mongo/entities/product.model";

export interface IProductPort {
    getProductById(productId: string): Promise<AxiosResponse<Product>>;
    getProductBySKU(productSKU: string): Promise<AxiosResponse<Product>>;
}

export const IProductPortToken = Symbol("IProductPort");