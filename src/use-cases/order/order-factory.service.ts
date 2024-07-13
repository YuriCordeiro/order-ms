import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { OrderDTO } from 'src/dto/order.dto';
import { Order } from 'src/frameworks/data-services/mongo/entities/order.model';

@Injectable()
export class OrderFactoryService {

  constructor(private dataServices: IDataServices) { }

  async createNewOrder(cartId: string, queuePosition: number): Promise<Order> {
    const foundCart = await this.dataServices.carts.get(cartId);
    const order = new Order();

    order.customer = foundCart.customer;
    // const customerClientResponse = await this.customerClient.getCustomerByCPF(order.customer.cpf);
    // order.customer = customerClientResponse.data;

    order.products = foundCart.products;
    // order.products.forEach(async (product) => {
    //   const productSKU = product.sku;
    //   const productClientResponse = await this.productClient.getProductBySKU(productSKU); // Validate each product by it's Sku before inserting into cart
    //   const foundProduct = productClientResponse.data;
    //   if (foundProduct) {
    //     order.products.push(foundProduct);
    //   }
    // });

    order.paymentTransaction = foundCart.paymentTransaction;

    order.value = foundCart.total;
    order.status = "Em Preparação";
    order.queuePosition = queuePosition;
    order.createdAt = new Date();
    return order;
  }

  updateOrder(orderDTO: OrderDTO): Order {
    const updatedOrder = new Order();

    Object.entries(orderDTO).forEach(([key, value]) => {
      if (key === 'id') return;
      updatedOrder[key] = value;
    });
    return updatedOrder;
  }

  updateStatus(status: string): Order {
    const updatedOrder = new Order();
    updatedOrder['status'] = status;

    return updatedOrder;
  }
}
