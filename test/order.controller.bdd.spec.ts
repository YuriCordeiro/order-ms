import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderUseCases } from 'src/use-cases/order/order.use-case';
import { OrderController } from 'src/controllers/order.controller';
import { Order } from 'src/frameworks/data-services/mongo/entities/order.model';

const feature = loadFeature('./test/order.feature');

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

defineFeature(feature, test => {
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

  test('Create a new order', ({ given, when, then }) => {
    let cartId: string;
    let order: Order;

    given('I have a cart with ID "cart123"', () => {
      cartId = 'cart123';
    });

    when('I create an order', async () => {
      order = { status: 'pending' } as Order;
      orderUseCases.createOrder.mockResolvedValue(order);
      order = await orderController.createOrder(cartId);
    });

    then('I should receive an order with status "pending"', () => {
      expect(order).toEqual({ status: 'pending' });
      expect(orderUseCases.createOrder).toHaveBeenCalledWith(cartId);
    });
  });

  test('Get all orders', ({ given, when, then }) => {
    let orders: Order[];

    given('there are orders in the system', () => {
      orders = [
        { status: 'pending' } as Order,
        { status: 'completed' } as Order,
      ];
      orderUseCases.getOrdersByPriority.mockResolvedValue(orders);
    });

    when('I get all orders', async () => {
      orders = await orderController.getAllOrders();
    });

    then('I should receive a list of orders', () => {
      expect(orders).toEqual([
        { status: 'pending' },
        { status: 'completed' },
      ]);
      expect(orderUseCases.getOrdersByPriority).toHaveBeenCalled();
    });
  });

  test('Get an order by ID', ({ given, when, then }) => {
    let orderId: string;
    let order: Order;

    given('there is an order with ID "orderId"', () => {
      orderId = 'orderId';
      order = { _id: orderId, status: 'pending' } as unknown as Order;
      orderUseCases.getOrderById.mockResolvedValue(order);
    });

    when('I get the order by ID "orderId"', async () => {
      order = await orderController.getOrderById(orderId);
    });

    then('I should receive the order with status "pending"', () => {
      expect(order).toEqual({ _id: 'orderId', status: 'pending' });
      expect(orderUseCases.getOrderById).toHaveBeenCalledWith(orderId);
    });
  });
});