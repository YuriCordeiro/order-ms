import { Test, TestingModule } from '@nestjs/testing';
import { CartUseCases } from 'src/use-cases/cart/cart.use-case';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { CartFactoryService } from 'src/use-cases/cart/cart-factory.service';
import { IProductPort, IProductPortToken } from 'src/frameworks/api-services/http/ports/product.port';
import { ICustomerPort, ICustomerPortToken } from 'src/frameworks/api-services/http/ports/customer.port';
import { ITransactionPort, ITransactionPortToken } from 'src/frameworks/api-services/http/ports/transaction.port';
import { Cart } from 'src/frameworks/data-services/mongo/entities/cart.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CartAddProductDTO } from 'src/dto/cart-add-product.dto';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';
import { Customer } from 'src/frameworks/data-services/mongo/entities/customer.model';
import { Transaction } from 'src/frameworks/data-services/mongo/entities/transaction.model';

const mockDataServices = () => ({
  carts: {
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
});

const mockCartFactoryService = () => ({
  createNewCart: jest.fn(),
});

const mockProductClient = () => ({
  getProductById: jest.fn(),
});

const mockCustomerClient = () => ({
  getCustomerByID: jest.fn(),
});

const mockTransactionClient = () => ({
  getTransactionById: jest.fn(),
});

describe('CartUseCases', () => {
  let cartUseCases: CartUseCases;
  let dataServices;
  let cartFactoryService;
  let productClient;
  let customerClient;
  let transactionClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartUseCases,
        { provide: IDataServices, useFactory: mockDataServices },
        { provide: CartFactoryService, useFactory: mockCartFactoryService },
        { provide: IProductPortToken, useFactory: mockProductClient },
        { provide: ICustomerPortToken, useFactory: mockCustomerClient },
        { provide: ITransactionPortToken, useFactory: mockTransactionClient },
      ],
    }).compile();

    cartUseCases = module.get<CartUseCases>(CartUseCases);
    dataServices = module.get<IDataServices>(IDataServices);
    cartFactoryService = module.get<CartFactoryService>(CartFactoryService);
    productClient = module.get<IProductPort>(IProductPortToken);
    customerClient = module.get<ICustomerPort>(ICustomerPortToken);
    transactionClient = module.get<ITransactionPort>(ITransactionPortToken);
  });

  it('should be defined', () => {
    expect(cartUseCases).toBeDefined();
  });

  describe('getAllCarts', () => {
    it('should return an array of carts', async () => {
      const carts = [{ total: 100 } as Cart, { total: 200 } as Cart];
      dataServices.carts.getAll.mockResolvedValue(carts);

      const result = await cartUseCases.getAllCarts();
      expect(result).toEqual(carts);
      expect(dataServices.carts.getAll).toHaveBeenCalled();
    });
  });

  describe('createCart', () => {
    it('should create and return a new cart', async () => {
      const newCart = { total: 0 } as Cart;
      cartFactoryService.createNewCart.mockReturnValue(newCart);
      dataServices.carts.create.mockResolvedValue(newCart);

      const result = await cartUseCases.createCart();
      expect(result).toEqual(newCart);
      expect(cartFactoryService.createNewCart).toHaveBeenCalled();
      expect(dataServices.carts.create).toHaveBeenCalledWith(newCart);
    });
  });

  describe('getCartById', () => {
    it('should return a cart by ID', async () => {
      const cartId = '123456789012345678901234';
      const cart = { _id: cartId, total: 100 } as unknown as Cart;
      dataServices.carts.get.mockResolvedValue(cart);

      const result = await cartUseCases.getCartById(cartId);
      expect(result).toEqual(cart);
      expect(dataServices.carts.get).toHaveBeenCalledWith(cartId);
    });

    it('should throw NotFoundException when cart is not found', async () => {
      const cartId = '123456789012345678901234';
      dataServices.carts.get.mockResolvedValue(null);

      await expect(cartUseCases.getCartById(cartId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      const invalidId = 'invalid-id';

      await expect(cartUseCases.getCartById(invalidId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('addProductToCart', () => {
    it('should add a product to the cart and return the updated cart', async () => {
      const cartId = '123456789012345678901234';
      const productId = '123456789012345678901234';
      const quantity = { quantity: 2 } as CartAddProductDTO;
      const cart = { _id: cartId, total: 100, products: [] } as unknown as Cart;
      const product = { _id: productId, value: 50, quantity: 2 } as unknown as Product;

      dataServices.carts.get.mockResolvedValue(cart);
      productClient.getProductById.mockResolvedValue({ data: product });
      dataServices.carts.update.mockResolvedValue(cart);

      const result = await cartUseCases.addProductToCart(cartId, productId, quantity);
      expect(result).toEqual(cart);
      expect(dataServices.carts.get).toHaveBeenCalledWith(cartId);
      expect(productClient.getProductById).toHaveBeenCalledWith(productId);
      expect(dataServices.carts.update).toHaveBeenCalledWith(cartId, cart);
    });
  });

  describe('addPaymentTransactionToCart', () => {
    it('should add a payment transaction to the cart and return the updated cart', async () => {
      const cartId = '123456789012345678901234';
      const transactionId = '123456789012345678901234';
      const cart = { _id: cartId, total: 100, products: [] } as unknown as Cart;
      const transaction = { _id: transactionId, status: 'completed' } as unknown as Transaction;

      dataServices.carts.get.mockResolvedValue(cart);
      transactionClient.getTransactionById.mockResolvedValue({ data: transaction });
      dataServices.carts.update.mockResolvedValue(cart);

      const result = await cartUseCases.addPaymentTransactionToCart(cartId, transactionId);
      expect(result).toEqual(cart);
      expect(dataServices.carts.get).toHaveBeenCalledWith(cartId);
      expect(transactionClient.getTransactionById).toHaveBeenCalledWith(transactionId);
      expect(dataServices.carts.update).toHaveBeenCalledWith(cartId, cart);
    });
  });

  describe('addCustomerToCart', () => {
    it('should add a customer to the cart and return the updated cart', async () => {
      const cartId = '123456789012345678901234';
      const customerId = '123456789012345678901234';
      const cart = { _id: cartId, total: 100, products: [] } as unknown as Cart;
      const customer = { _id: customerId, name: 'John Doe' } as unknown as Customer;

      dataServices.carts.get.mockResolvedValue(cart);
      customerClient.getCustomerByID.mockResolvedValue({ data: customer });
      dataServices.carts.update.mockResolvedValue(cart);

      const result = await cartUseCases.addCustomerToCart(cartId, customerId);
      expect(result).toEqual(cart);
      expect(dataServices.carts.get).toHaveBeenCalledWith(cartId);
      expect(customerClient.getCustomerByID).toHaveBeenCalledWith(customerId);
      expect(dataServices.carts.update).toHaveBeenCalledWith(cartId, cart);
    });
  });
});
