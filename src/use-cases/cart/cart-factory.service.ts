import { Injectable } from "@nestjs/common";
import { Cart } from "../../frameworks/data-services/mongo/entities/cart.model";

@Injectable()
export class CartFactoryService {

    createNewCart() {
        const newCart = new Cart();
        newCart.total = 0;
        return newCart;
    }

    // entityToDTO(cartEntity: Cart) {
    //     const costumer = cartEntity.customer;
    //     const id = cartEntity.id;
    //     const paymentTransaction = cartEntity.paymentTransaction;
    //     const products = cartEntity.products;
    //     const total = cartEntity.total;

    //     let cartDTO: CartResponseDTO = new CartResponseDTO();
    //     cartDTO.id = id;
    //     cartDTO.paymentTransaction = paymentTransaction;
    //     cartDTO.products = products;
    //     cartDTO.total = total;
    //     cartDTO.customer = costumer;

    //     return cartDTO;
    // }
}