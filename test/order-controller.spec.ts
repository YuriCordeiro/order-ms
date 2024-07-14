import { Test, TestingModule } from '@nestjs/testing';
import { OrderUseCases } from 'src/use-cases/order/order.use-case';
import { OrderDTO } from 'src/dto/order.dto';
import { PutOrderStatusDTO } from 'src/dto/put-order-status.dto';
import { Order } from 'src/frameworks/data-services/mongo/entities/order.model';
import { CustomerDTO } from 'src/dto/customer.dto';
import { OrderController } from 'src/controllers/order.controller';

const mockOrderUseCases = () => ({
  createOrder: jest.fn(),
  getAllOrders: jest.fn(),
  getOrderById: jest.fn(),
  getOrderByStatus: jest.fn(),
  updateOrder: jest.fn(),
  updateStatus: jest.fn(),
  deleteOrder: jest.fn(),
  getOrdersByPriority: jest.fn(),
});

describe('OrderController', () => {
  let orderController: OrderController;
  let orderUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderUseCases, useFactory: mockOrderUseCases },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderUseCases = module.get<OrderUseCases>(OrderUseCases);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create and return a new order', async () => {
      const cartId = 'cart123';
      const order = { status: 'pending' } as Order;
      orderUseCases.createOrder.mockResolvedValue(order);

      const result = await orderController.createOrder(cartId);
      expect(result).toEqual(order);
      expect(orderUseCases.createOrder).toHaveBeenCalledWith(cartId);
    });
  });

  describe('getAllOrders', () => {
    it('should return an array of orders', async () => {
      const orders = [
        { status: 'pending' } as Order,
        { status: 'completed' } as Order,
      ];
      orderUseCases.getOrdersByPriority.mockResolvedValue(orders);

      const result = await orderController.getAllOrders();
      expect(result).toEqual(orders);
      expect(orderUseCases.getOrdersByPriority).toHaveBeenCalled();
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      const orderId = 'orderId';
      const order = { _id: orderId, status: 'pending' } as unknown as Order;
      orderUseCases.getOrderById.mockResolvedValue(order);

      const result = await orderController.getOrderById(orderId);
      expect(result).toEqual(order);
      expect(orderUseCases.getOrderById).toHaveBeenCalledWith(orderId);
    });
  });

  describe('getOrderByStatus', () => {
    it('should return an array of orders by status', async () => {
      const status = 'pending';
      const orders = [{ status: 'pending' } as Order];
      orderUseCases.getOrderByStatus.mockResolvedValue(orders);

      const result = await orderController.getOrderByStatus(status);
      expect(result).toEqual(orders);
      expect(orderUseCases.getOrderByStatus).toHaveBeenCalledWith(status);
    });
  });

  describe('updateOrder', () => {
    it('should update and return the order', async () => {
      const orderId = 'orderId';
      const orderDTO: OrderDTO = {
        status: 'completed',
        products: [],
        value: 0,
        customer: new CustomerDTO
      };
      const updatedOrder = { _id: orderId, status: 'completed' } as unknown as Order;
      orderUseCases.updateOrder.mockResolvedValue(updatedOrder);

      const result = await orderController.updateOrder(orderId, orderDTO);
      expect(result).toEqual(updatedOrder);
      expect(orderUseCases.updateOrder).toHaveBeenCalledWith(orderId, orderDTO);
    });
  });

  describe('updateStatus', () => {
    it('should update and return the order status', async () => {
      const orderId = 'orderId';
      const putOrderStatusDTO: PutOrderStatusDTO = { status: 'completed' };
      const updatedOrder = { _id: orderId, status: 'completed' } as unknown as Order;
      orderUseCases.updateStatus.mockResolvedValue(updatedOrder);

      const result = await orderController.updateStatus(orderId, putOrderStatusDTO);
      expect(result).toEqual(updatedOrder);
      expect(orderUseCases.updateStatus).toHaveBeenCalledWith(orderId, putOrderStatusDTO);
    });
  });

  describe('deleteOrder', () => {
    it('should delete the order', async () => {
      const orderId = 'orderId';
      orderUseCases.deleteOrder.mockResolvedValue(undefined);

      await orderController.deleteOrder(orderId);
      expect(orderUseCases.deleteOrder).toHaveBeenCalledWith(orderId);
    });
  });
});
