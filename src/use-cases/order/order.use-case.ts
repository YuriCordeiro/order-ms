import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { OrderFactoryService } from './order-factory.service';
import { OrderDTO } from 'src/dto/order.dto';
import { Order } from 'src/frameworks/data-services/mongo/entities/order.model';
import { PutOrderStatusDTO } from 'src/dto/put-order-status.dto';
import { WebhookDTO } from 'src/dto/webhook-transaction.dto';

@Injectable()
export class OrderUseCases {

  constructor(
    private dataServices: IDataServices,
    private orderFactoryService: OrderFactoryService
  ) { }

  /**
   * 
   * @returns All registered orders sorted by queuePosition field, asc
   */
  async getAllOrders(): Promise<Order[]> {
    return (await this.dataServices.orders.getAll())
      .sort(
        // Order by asc
        (a, b) => a.queuePosition - b.queuePosition
      );
  }

  getOrderById(id: string): Promise<Order> {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const orderProduct = this.dataServices.orders.get(id);

      if (orderProduct != null) {
        return orderProduct;
      } else {
        throw new NotFoundException(
          `Order with id: ${id} not found at database.`,
        );
      }
    } else {
      throw new BadRequestException(`'${id}' is not a valid ObjectID`);
    }
  }

  async getOrderByStatus(status: string): Promise<Order[]> {
    return this.dataServices.orders.getOrderByStatus(status);
  }

  async getOrdersByPriority(): Promise<Order[]> {
    const orders = await this.dataServices.orders.getAll();

    const doneOrders = orders.filter((order) => order.status === 'Pronto');
    const doingOrders = orders.filter((order) => order.status === 'Em Preparação');
    const receivedOrders = orders.filter((order) => order.status === 'Recebido');

    doneOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    doingOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    receivedOrders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return [...doneOrders, ...doingOrders, ...receivedOrders];
  }

  async createOrder(cartId: string): Promise<Order> {
    const newOrder = this.orderFactoryService.createNewOrder(cartId, await this.mapActualQueuePosition());
    return this.dataServices.orders.create(await newOrder);
  }

  async mapActualQueuePosition() {
    return (await this.dataServices.orders.getAll()).length + 1;
  }

  updateOrder(orderId: string, orderDTO: OrderDTO): Promise<Order> {
    const newOrder = this.orderFactoryService.updateOrder(orderDTO);
    return this.dataServices.orders.update(orderId, newOrder);
  }

  async updateStatus(orderId: string, putOrderStatusDTO: PutOrderStatusDTO): Promise<Order> {
    const foundOrder = await this.getOrderById(orderId);
    const orderStatusCapitalized = this.captalizeOrderStatus(putOrderStatusDTO.status)
    foundOrder.status = orderStatusCapitalized;
    return this.dataServices.orders.update(orderId, foundOrder);
  }

  async updateOrderTransactionStatus(payload: WebhookDTO): Promise<Order> {
    const foundOrder = await this.getOrderById(payload.orderId);
    foundOrder.paymentTransaction.status = payload.status;
    return this.dataServices.orders.update(payload.orderId, foundOrder);
  }

  deleteOrder(orderId: string) {
    const foundOrder = this.getOrderById(orderId);
    this.dataServices.orders.delete(orderId);
  }

  private captalizeOrderStatus(status: string): string {
    return status.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
