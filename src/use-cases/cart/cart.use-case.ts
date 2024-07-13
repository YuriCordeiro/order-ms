import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Cart } from "src/frameworks/data-services/mongo/entities/cart.model";
import { CartFactoryService } from "./cart-factory.service";
import { CartAddProductDTO } from "src/dto/cart-add-product.dto";
import { Product } from "src/frameworks/data-services/mongo/entities/product.model";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { Transaction } from "src/frameworks/data-services/mongo/entities/transaction.model";
import { Customer } from "src/frameworks/data-services/mongo/entities/customer.model";

@Injectable()
export class CartUseCases {

    // constructor(private dataServices: IDataServices, private cartFactoryService: CartFactoryService, private productUseCase: ProductUseCases) { }
    // constructor(private dataServices: IDataServices, private cartFactoryService: CartFactoryService,
    //     @Inject('PRODUCTS_SERVICE') private client: ClientProxy) { }
    constructor(private dataServices: IDataServices, private cartFactoryService: CartFactoryService, private readonly httpService: HttpService) { }

    async getAllCarts(): Promise<Cart[]> {
        return this.dataServices.carts.getAll();
    }

    async createCart(): Promise<Cart> {
        const newCart = this.cartFactoryService.createNewCart();
        return this.dataServices.carts.create(newCart);
    }

    async getCartById(cartId: string): Promise<Cart> {
        if (cartId.match(/^[0-9a-fA-F]{24}$/)) {
            const foundCart = await this.dataServices.carts.get(cartId);

            if (foundCart != null) {
                if (!foundCart.products) { // If there is no products on cart, create empty list
                    foundCart.products = new Array<Product>();
                }
                return foundCart;
            } else {
                throw new NotFoundException(`Cart with id: ${cartId} not found at database.`);
            }
        } else {
            throw new BadRequestException(`'${cartId}' is not a valid ObjectID`);
        }
    }

    /**
     * Access external product microservice to get an existent product
     * @param productId product id
     * @returns Product
     */
    getProduct(productId: string): Promise<AxiosResponse<Product>> {
        const localURL = `http://0.0.0.0:3000/products/id/${productId}`;
        const containerURL = `http://product_ms:3000/products/id/${productId}`;

        return this.httpService.
            axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

    /**
     * Access external payment microservice to get an existent transaction by id
     * @param transactionId transaction id
     * @returns Transaction
     */
    getTransaction(transactionId: string): Promise<AxiosResponse<Transaction>> {
        const localURL = `http://0.0.0.0:3003/transactions/${transactionId}`;
        const containerURL = `http://payment_ms:3003/transactions/${transactionId}`;

        return this.httpService.
            axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

    /**
     * Access external customer microservice to get an existent transaction by id
     * @param customerId customer id
     * @returns Customer
     */
    getCustomer(customerId: string): Promise<AxiosResponse<Customer>> {
        const localURL = `http://0.0.0.0:3004/customers/id/${customerId}`;
        const containerURL = `http://customer_ms:3004/customers/id/${customerId}`;

        return this.httpService.
            axiosRef.get(localURL)
            .catch(() => {
                return this.httpService.
                    axiosRef.get(containerURL)
            });
    }

    async addProductToCart(cartId: string, productId: string, quantity: CartAddProductDTO): Promise<Cart> {
        const foundCart = await this.getCartById(cartId);
        const response = await this.getProduct(productId);
        const foundProduct = response.data;

        foundProduct.quantity = quantity.quantity;
        this.validateProductQuantity(foundCart, foundProduct);
        foundCart.total += this.calculateProductQuantity(foundProduct);

        return this.dataServices.carts.update(cartId, foundCart);
    }

    async addPaymentTransactionToCart(cartId: string, transactionId: string): Promise<Cart> {
        const foundCart = await this.getCartById(cartId);
        const response = await this.getTransaction(transactionId);
        const foundTransaction = response.data;
        foundCart.paymentTransaction = foundTransaction;

        return this.dataServices.carts.update(cartId, foundCart);
    }

    async addCustomerToCart(cartId: string, customerId: string): Promise<Cart> {
        const foundCart = await this.getCartById(cartId);
        const response = await this.getCustomer(customerId);
        const foundCustomer = response.data;
        foundCart.customer = foundCustomer;

        return this.dataServices.carts.update(cartId, foundCart);
    }

    private validateProductQuantity(selectedCart: Cart, selectedProduct: Product): void {
        selectedCart.products
            .filter((product) => product.sku === selectedProduct.sku)
            .map((filteredProduct) => filteredProduct.quantity += filteredProduct.quantity);

        if (!selectedCart.products.find((product) => product.sku === selectedProduct.sku)) {
            selectedCart.products.push(selectedProduct);
        }
    }

    private calculateProductQuantity(selectedProduct: Product): number {
        return selectedProduct.value * selectedProduct.quantity;
    }
}
