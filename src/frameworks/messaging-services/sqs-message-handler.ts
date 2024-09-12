import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { SqsMessageHandler } from "@ssut/nestjs-sqs";
import { Message } from "@aws-sdk/client-sqs";
import { JOB_TYPES, MessageBody } from "./sqs-messaging-services.service";
import { WebhookMessageDTO } from "src/dto/webhook-transaction.dto";
import { OrderUseCases } from "src/use-cases/order/order.use-case";
import { CartUseCases } from "src/use-cases/cart/cart.use-case";

@Injectable()
export class MessageHandler {

    private readonly logger = new Logger(MessageHandler.name);
    
    constructor(private orderService: OrderUseCases, private cartService: CartUseCases) { }

    @SqsMessageHandler(process.env.SQS_QUEUE_NAME, false)
    async handleMessage(message: Message) {
    this.logger.log(`handleMessage() - Consumer  Start`);
    const msgBody: MessageBody = JSON.parse(message.Body) as MessageBody;
    this.logger.log(`Reading message with ID: ${msgBody.messageId}`)

    if (msgBody.MessageAttributes.job.value !in JOB_TYPES) {
      Logger.error('Invalid job type ' + msgBody.MessageAttributes.job.value);
      throw new InternalServerErrorException(
        'Invalid job type ' + msgBody.MessageAttributes.job.value,
      );
    }

    try {
      const strMessage = JSON.stringify(msgBody.message);
      const webhookReceivedMessage: WebhookMessageDTO = JSON.parse(strMessage) as WebhookMessageDTO;
      const foundCarts = await this.cartService.getAllCarts();
      
      const foundCart = foundCarts
        .filter(cart => cart.paymentTransaction != null)
        .find(cart => cart.paymentTransaction._id === webhookReceivedMessage._id);

      if(foundCart != null) {
        const cartId = foundCart._id.toString();
        this.logger.log(`Cart with ID: ${cartId} has been found: ${foundCart}`);
        const createdOrder = await this.orderService.createOrder(cartId); // Create order and send message to NEW_ORDER queue
        this.logger.log(`New order has been created with ID: ${createdOrder.id}`);
      } else {
        this.logger.log(`No cart were found with transaction ID: ${webhookReceivedMessage._id}`);
      }
    } catch (error) {
      console.log('consumer error', JSON.stringify(error));
      //keep the message in sqs
      Logger.error(error.message);
      throw new InternalServerErrorException(error);
   
        }
    }
}

