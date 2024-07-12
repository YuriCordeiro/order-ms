import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { CartFactoryService } from "./cart-factory.service";
import { CartUseCases } from "./cart.use-case";
import { HttpModule } from "@nestjs/axios";
//import { ProductUseCaseModule } from "../product/product.use-cases.module";

@Module({
    // imports: [DataServicesModule, ProductUseCaseModule],
    // providers: [CartFactoryService, CartUseCases, ProductUseCaseModule],
    imports: [DataServicesModule, HttpModule],
    providers: [CartFactoryService, CartUseCases],
    exports: [CartFactoryService, CartUseCases]
})
export class CartUseCaseModule {
};
