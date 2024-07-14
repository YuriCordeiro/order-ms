import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { ApiTags } from '@nestjs/swagger';
  import { OrderDTO } from 'src/dto/order.dto';
  import { PutOrderStatusDTO } from 'src/dto/put-order-status.dto';
  import { Order } from 'src/frameworks/data-services/mongo/entities/order.model';
  import { OrderUseCases } from 'src/use-cases/order/order.use-case';
  
  @ApiTags('Orders')
  @Controller('/orders')
  export class OrderController {
    private readonly logger = new Logger(OrderController.name);
  
    constructor(private orderUseCases: OrderUseCases) { }
  
    @Post('/cart/:cartId')
    async createOrder(@Param('cartId') cartId: string): Promise<Order> {
      this.logger.log(`createOrder() - Start`);
      return this.orderUseCases.createOrder(cartId);
    }
  
    @Get()
    async getAllOrders() {
      this.logger.log(`getAllOrders() - Start`);
      return await this.orderUseCases.getOrdersByPriority();
    }
  
    @Get('/id/:orderId')
    async getOrderById(@Param('orderId') orderId: string): Promise<Order> {
      this.logger.log(`getOrderById(string) - Start`);
      return await this.orderUseCases.getOrderById(orderId);
    }
  
    @Get('/status/:status')
    async getOrderByStatus(@Param('status') status: string): Promise<Order[]> {
      this.logger.log(`getOrderByStatus(string) - Start`);
      return this.orderUseCases.getOrderByStatus(status);
    }
  
    @Put('/:orderId')
    async updateOrder(
      @Param('orderId') orderId: string,
      @Body() orderDTO: OrderDTO,
    ): Promise<Order> {
      this.logger.log(`updateOrder(string, OrderDTO) - Start`);
      return this.orderUseCases.updateOrder(orderId, orderDTO);
    }
  
    @Put('/:orderId/status')
    async updateStatus(
      @Param('orderId') orderId: string,
      @Body() putOrderStatusDTO: PutOrderStatusDTO,
    ): Promise<Order> {
      this.logger.log(`updateStatus(string, OrderDTO) - Start`);
      return this.orderUseCases.updateStatus(orderId, putOrderStatusDTO);
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:orderId')
    async deleteOrder(@Param('orderId') orderId: string): Promise<void> {
      this.logger.log(`deleteOrder(String) - Start`);
      return this.orderUseCases.deleteOrder(orderId);
    }
  }
  