import { Test, TestingModule } from '@nestjs/testing';
import { CartUseCases } from 'src/use-cases/cart/cart.use-case';
import { Cart } from 'src/frameworks/data-services/mongo/entities/cart.model';
import { CartAddProductDTO } from 'src/dto/cart-add-product.dto';
import { CartController } from 'src/controllers/cart.controller';

const mockCartUseCases = () => ({
  createCart: jest.fn(),
  getAllCarts: jest.fn(),
  getCartById: jest.fn(),
  addProductToCart: jest.fn(),
  addPaymentTransactionToCart: jest.fn(),
  addCustomerToCart: jest.fn(),
});

describe('CartController', () => {
  let cartController: CartController;
  let cartUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        { provide: CartUseCases, useFactory: mockCartUseCases },
      ],
    }).compile();

    cartController = module.get<CartController>(CartController);
    cartUseCases = module.get<CartUseCases>(CartUseCases);
  });

  it('should be defined', () => {
    expect(cartController).toBeDefined();
  });

  describe('createCart', () => {
    it('should create and return a new cart', async () => {
      const cart = { total: 0 } as Cart;
      cartUseCases.createCart.mockResolvedValue(cart);

      const result = await cartController.createCart();
      expect(result).toEqual(cart);
      expect(cartUseCases.createCart).toHaveBeenCalled();
    });
  });

  describe('getAllCarts', () => {
    it('should return an array of carts', async () => {
      const carts = [{ total: 100 } as Cart, { total: 200 } as Cart];
      cartUseCases.getAllCarts.mockResolvedValue(carts);

      const result = await cartController.getAllCarts();
      expect(result).toEqual(carts);
      expect(cartUseCases.getAllCarts).toHaveBeenCalled();
    });
  });

  describe('getCartById', () => {
    it('should return a cart by ID', async () => {
      const cartId = 'cartId';
      const cart = { _id: cartId, total: 100 } as unknown as Cart;
      cartUseCases.getCartById.mockResolvedValue(cart);

      const result = await cartController.getCartById(cartId);
      expect(result).toEqual(cart);
      expect(cartUseCases.getCartById).toHaveBeenCalledWith(cartId);
    });
  });

  describe('addProductToCart', () => {
    it('should add a product to the cart and return the updated cart', async () => {
      const cartId = 'cartId';
      const productId = 'productId';
      const cartAddProductDTO: CartAddProductDTO = { quantity: 2 };
      const cart = { _id: cartId, total: 200 } as unknown as Cart;

      cartUseCases.addProductToCart.mockResolvedValue(cart);

      const result = await cartController.addProductToCart(cartId, productId, cartAddProductDTO);
      expect(result).toEqual(cart);
      expect(cartUseCases.addProductToCart).toHaveBeenCalledWith(cartId, productId, cartAddProductDTO);
    });
  });

  describe('addPaymentTransactionToCart', () => {
    it('should add a payment transaction to the cart and return the updated cart', async () => {
      const cartId = 'cartId';
      const transactionId = 'transactionId';
      const cart = { _id: cartId, total: 200 } as unknown as Cart;

      cartUseCases.addPaymentTransactionToCart.mockResolvedValue(cart);

      const result = await cartController.addPaymentTransactionToCart(cartId, transactionId);
      expect(result).toEqual(cart);
      expect(cartUseCases.addPaymentTransactionToCart).toHaveBeenCalledWith(cartId, transactionId);
    });
  });

  describe('addCustomerToCart', () => {
    it('should add a customer to the cart and return the updated cart', async () => {
      const cartId = 'cartId';
      const customerId = 'customerId';
      const cart = { _id: cartId, total: 200 } as unknown as Cart;

      cartUseCases.addCustomerToCart.mockResolvedValue(cart);

      const result = await cartController.addCustomerToCart(cartId, customerId);
      expect(result).toEqual(cart);
      expect(cartUseCases.addCustomerToCart).toHaveBeenCalledWith(cartId, customerId);
    });
  });
});