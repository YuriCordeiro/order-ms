import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';
import { CustomerDTO } from './customer.dto';

export class OrderDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  readonly products: Product[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly value: number;

  @ApiProperty()
  @IsOptional()
  readonly customer: CustomerDTO;
}
