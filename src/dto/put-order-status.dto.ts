import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class PutOrderStatusDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly status: string;
}
