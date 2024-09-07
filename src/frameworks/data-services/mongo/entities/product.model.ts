import { blob } from "aws-sdk/clients/codecommit";

export class Product {
  name: string;
  sku: string;
  category: string;
  // image: blob;
  value: number;
  quantity: number;
  description: string;
}
