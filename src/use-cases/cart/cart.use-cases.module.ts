import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { CartFactoryService } from "./cart-factory.service";
import { CartUseCases } from "./cart.use-case";
import { HttpModule } from "@nestjs/axios";
import { ProductAdapter } from "src/frameworks/api-services/http/adapters/product.adapter";
import { IProductPortToken } from "src/frameworks/api-services/http/ports/product.port";
import { ICustomerPortToken } from "src/frameworks/api-services/http/ports/customer.port";
import { CustomerAdapter } from "src/frameworks/api-services/http/adapters/customer.adapter";
import { ITransactionPortToken } from "src/frameworks/api-services/http/ports/transaction.port";
import { TransactionAdapter } from "src/frameworks/api-services/http/adapters/transaction.adapter";
import { MessageHandler } from "src/frameworks/messaging-services/sqs-message-handler";
import { OrderUseCases } from "../order/order.use-case";
import { OrderFactoryService } from "../order/order-factory.service";
import { SQSProducerService } from "src/frameworks/messaging-services/sqs-messaging-services.service";

@Module({
    imports: [DataServicesModule, HttpModule],
    providers: [CartFactoryService, CartUseCases, OrderUseCases, OrderFactoryService, SQSProducerService,
        { provide: IProductPortToken, useClass: ProductAdapter },
        { provide: ICustomerPortToken, useClass: CustomerAdapter },
        { provide: ITransactionPortToken, useClass: TransactionAdapter },
        MessageHandler
    ],
    exports: [CartFactoryService, CartUseCases, MessageHandler, OrderUseCases, OrderFactoryService, SQSProducerService]
})
export class CartUseCaseModule {
};
