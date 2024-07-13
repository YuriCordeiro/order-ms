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

@Module({
    imports: [DataServicesModule, HttpModule,],
    providers: [CartFactoryService, CartUseCases,
        { provide: IProductPortToken, useClass: ProductAdapter },
        { provide: ICustomerPortToken, useClass: CustomerAdapter },
        { provide: ITransactionPortToken, useClass: TransactionAdapter }
    ],
    exports: [CartFactoryService, CartUseCases]
})
export class CartUseCaseModule {
};
