import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/order.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/frameworks/data-services/mongo/entities/order.model';

// Mock do modelo Order
const mockOrderModel = () => ({
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
});

describe('OrderRepositoryImpl', () => {
  let repository: OrderRepositoryImpl;
  let orderModel: ReturnType<typeof mockOrderModel>;

  beforeEach(async () => {
    orderModel = mockOrderModel() as any;

    repository = new OrderRepositoryImpl(orderModel as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getOrderByStatus', () => {
    it('should return an array of orders with the given status', async () => {
      const status = 'completed';
      const orders = [
        { status: 'completed', value: 100 } as unknown as Order,
        { status: 'pending', value: 200 } as unknown as Order,
      ];

      const filteredOrders = orders.filter(order => order.status === status);

      orderModel.find().exec.mockResolvedValue(filteredOrders);

      const result = await repository.getOrderByStatus(status);
      expect(result).toEqual(filteredOrders);
      expect(orderModel.find).toHaveBeenCalledWith({ status });
    });

    it('should return an empty array if no orders are found', async () => {
      const status = 'completed';
      orderModel.find().exec.mockResolvedValue([]);

      const result = await repository.getOrderByStatus(status);
      expect(result).toEqual([]);
      expect(orderModel.find).toHaveBeenCalledWith({ status });
    });
  });

  describe('getAll', () => {
    it('should return an array of orders', async () => {
      const orders = [
        { status: 'completed', total: 100 } as unknown as Order,
        { status: 'pending', total: 200 } as unknown as Order,
      ];
      orderModel.find().exec.mockResolvedValue(orders);

      const result = await repository.getAll();
      expect(result).toEqual(orders);
      expect(orderModel.find).toHaveBeenCalled();
    });

    it('should return an empty array if no orders are found', async () => {
      orderModel.find().exec.mockResolvedValue([]);

      const result = await repository.getAll();
      expect(result).toEqual([]);
      expect(orderModel.find).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return an order by ID', async () => {
      const orderId = 'orderId';
      const order = { _id: orderId, status: 'pending' } as unknown as Order;
      orderModel.findById().exec.mockResolvedValue(order);

      const result = await repository.get(orderId);
      expect(result).toEqual(order);
      expect(orderModel.findById).toHaveBeenCalledWith(orderId);
    });
  });

  describe('create', () => {
    it('should create and return a new order', async () => {
      const order = { status: 'pending' } as Order;
      orderModel.create.mockResolvedValue(order);

      const result = await repository.create(order);
      expect(result).toEqual(order);
      expect(orderModel.create).toHaveBeenCalledWith(order);
    });
  });

  describe('update', () => {
    it('should update and return the order', async () => {
      const orderId = 'orderId';
      const order = { _id: orderId, status: 'completed' } as unknown as Order;
      orderModel.findByIdAndUpdate.mockResolvedValue(order);

      const result = await repository.update(orderId, order);
      expect(result).toEqual(order);
      expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith(orderId, order, { new: true });
    });
  });

  describe('delete', () => {
    it('should delete the order', async () => {
      const orderId = 'orderId';
      orderModel.findByIdAndDelete().exec.mockResolvedValue(undefined);

      const result = await repository.delete(orderId);
      expect(result).toBeUndefined();
      expect(orderModel.findByIdAndDelete).toHaveBeenCalledWith(orderId);
    });
  });
});