import { Injectable } from "@nestjs/common";
import { Cart } from "../../frameworks/data-services/mongo/entities/cart.model";

@Injectable()
export class CartFactoryService {

    createNewCart() {
        const newCart = new Cart();
        newCart.total = 0;
        return newCart;
    }
}