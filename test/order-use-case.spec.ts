import { Test, TestingModule } from '@nestjs/testing';
import { OrderUseCases } from 'src/use-cases/order/order.use-case';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { OrderFactoryService } from 'src/use-cases/order/order-factory.service';
import { Order } from 'src/frameworks/data-services/mongo/entities/order.model';
import { OrderDTO } from 'src/dto/order.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PutOrderStatusDTO } from 'src/dto/put-order-status.dto';
import { WebhookDTO } from 'src/dto/webhook-transaction.dto';
import { CustomerDTO } from 'src/dto/customer.dto';

const mockDataServices = () => ({
  orders: {
    getAll: jest.fn(),
    get: jest.fn(),
    getOrderByStatus: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

const mockOrderFactoryService = () => ({
  createNewOrder: jest.fn(),
  updateOrder: jest.fn(),
});

describe('OrderUseCases', () => {
  let orderUseCases: OrderUseCases;
  let dataServices;
  let orderFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderUseCases,
        { provide: IDataServices, useFactory: mockDataServices },
        { provide: OrderFactoryService, useFactory: mockOrderFactoryService },
      ],
    }).compile();

    orderUseCases = module.get<OrderUseCases>(OrderUseCases);
    dataServices = module.get<IDataServices>(IDataServices);
    orderFactoryService = module.get<OrderFactoryService>(OrderFactoryService);
  });

  it('should be defined', () => {
    expect(orderUseCases).toBeDefined();
  });

  describe('getAllOrders', () => {
    it('should return an array of sorted orders', async () => {
      const orders = [
        { queuePosition: 2 } as Order,
        { queuePosition: 1 } as Order,
      ];
      dataServices.orders.getAll.mockResolvedValue(orders);

      const result = await orderUseCases.getAllOrders();
      expect(result).toEqual([
        { queuePosition: 1 } as Order,
        { queuePosition: 2 } as Order,
      ]);
      expect(dataServices.orders.getAll).toHaveBeenCalled();
    });
  });

  describe('getOrderById', () => {
    it('should return an order when found', async () => {
      const orderId = '123456789012345678901234';
      const order = { _id: orderId, status: 'pending' } as unknown as Order;
      dataServices.orders.get.mockResolvedValue(order);

      const result = await orderUseCases.getOrderById(orderId);
      expect(result).toEqual(order);
      expect(dataServices.orders.get).toHaveBeenCalledWith(orderId);
    });

    it('should throw NotFoundException when order is not found', async () => {
      const orderId = '123456789012345678901234';
      dataServices.orders.get.mockResolvedValue(null);

      await expect(orderUseCases.getOrderById(orderId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      const invalidId = 'invalid-id';

      await expect(orderUseCases.getOrderById(invalidId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOrderByStatus', () => {
    it('should return an array of orders with the given status', async () => {
      const status = 'pending';
      const orders = [{ status: 'pending' } as Order];

      const filteredOrders = orders.filter(order => order.status === status);

      dataServices.orders.getOrderByStatus.mockResolvedValue(filteredOrders);

      const result = await orderUseCases.getOrderByStatus(status);
      expect(result).toEqual(filteredOrders);
      expect(dataServices.orders.getOrderByStatus).toHaveBeenCalledWith(status);
    });
  });

  describe('createOrder', () => {
    it('should create and return a new order', async () => {
      const cartId = 'cart123';
      const order = { status: 'pending' } as Order;
      orderFactoryService.createNewOrder.mockResolvedValue(order);
      dataServices.orders.create.mockResolvedValue(order);
      dataServices.orders.getAll.mockResolvedValue([]);

      const result = await orderUseCases.createOrder(cartId);
      expect(result).toEqual(order);
      expect(orderFactoryService.createNewOrder).toHaveBeenCalledWith(cartId, 1);
      expect(dataServices.orders.create).toHaveBeenCalledWith(order);
    });
  });

  describe('updateOrder', () => {
    it('should update and return the order', async () => {
      const orderId = '123456789012345678901234';
      const orderDTO: OrderDTO = {
        status: 'completed',
        products: [],
        value: 0,
        customer: new CustomerDTO
      };
      const updatedOrder = { _id: orderId, status: 'completed' } as unknown as Order;
      orderFactoryService.updateOrder.mockReturnValue(updatedOrder);
      dataServices.orders.update.mockResolvedValue(updatedOrder);

      const result = await orderUseCases.updateOrder(orderId, orderDTO);
      expect(result).toEqual(updatedOrder);
      expect(orderFactoryService.updateOrder).toHaveBeenCalledWith(orderDTO);
      expect(dataServices.orders.update).toHaveBeenCalledWith(orderId, updatedOrder);
    });
  });

  describe('updateStatus', () => {
    it('should update and return the order status', async () => {
      const orderId = '123456789012345678901234';
      const putOrderStatusDTO: PutOrderStatusDTO = { status: 'completed' };
      const foundOrder = { _id: orderId, status: 'pending' } as unknown as Order;
      const updatedOrder = { _id: orderId, status: 'Completed' } as unknown as Order;
      dataServices.orders.get.mockResolvedValue(foundOrder);
      dataServices.orders.update.mockResolvedValue(updatedOrder);

      const result = await orderUseCases.updateStatus(orderId, putOrderStatusDTO);
      expect(result).toEqual(updatedOrder);
      expect(dataServices.orders.get).toHaveBeenCalledWith(orderId);
      expect(dataServices.orders.update).toHaveBeenCalledWith(orderId, updatedOrder);
    });
  });

  describe('updateOrderTransactionStatus', () => {
    it('should update the order transaction status', async () => {
      const payload: WebhookDTO = {
        orderId: '123456789012345678901234', status: 'completed',
        transactionId: ''
      };
      const foundOrder = { _id: 'orderId', paymentTransaction: { status: 'pending' } } as unknown as Order;
      const updatedOrder = { _id: 'orderId', paymentTransaction: { status: 'completed' } } as unknown as Order;
      dataServices.orders.get.mockResolvedValue(foundOrder);
      dataServices.orders.update.mockResolvedValue(updatedOrder);

      const result = await orderUseCases.updateOrderTransactionStatus(payload);
      expect(result).toEqual(updatedOrder);
      expect(dataServices.orders.get).toHaveBeenCalledWith(payload.orderId);
      expect(dataServices.orders.update).toHaveBeenCalledWith(payload.orderId, updatedOrder);
    });
  });

  describe('deleteOrder', () => {
    it('should delete the order', async () => {
      const orderId = '123456789012345678901234';
      const foundOrder = { _id: orderId, status: 'pending' } as unknown as Order;
      dataServices.orders.get.mockResolvedValue(foundOrder);

      await orderUseCases.deleteOrder(orderId);
      expect(dataServices.orders.get).toHaveBeenCalledWith(orderId);
      expect(dataServices.orders.delete).toHaveBeenCalledWith(orderId);
    });

    it('should throw NotFoundException when order is not found for deletion', async () => {
      const orderId = '123456789012345678901234';
      dataServices.orders.get.mockResolvedValue(null);

      await expect(orderUseCases.deleteOrder(orderId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrdersByPriority', () => {
    it('should return orders sorted by priority', async () => {
      const orders = [
        { status: 'Pronto', createdAt: new Date('2022-01-01') } as Order,
        { status: 'Em Preparação', createdAt: new Date('2022-01-02') } as Order,
        { status: 'Recebido', createdAt: new Date('2022-01-03') } as Order,
        { status: 'Pronto', createdAt: new Date('2022-01-04') } as Order,
      ];
      dataServices.orders.getAll.mockResolvedValue(orders);

      const result = await orderUseCases.getOrdersByPriority();
      expect(result).toEqual([
        { status: 'Pronto', createdAt: new Date('2022-01-01') } as Order,
        { status: 'Pronto', createdAt: new Date('2022-01-04') } as Order,
        { status: 'Em Preparação', createdAt: new Date('2022-01-02') } as Order,
        { status: 'Recebido', createdAt: new Date('2022-01-03') } as Order,
      ]);
      expect(dataServices.orders.getAll).toHaveBeenCalled();
    });
  });
});