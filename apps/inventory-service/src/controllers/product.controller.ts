import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  createProduct(
    @Body()
    body: {
      tenantId?: string;
      categoryId?: string;
      subcategoryId?: string;
      sku?: string;
      name?: string;
      unit?: string;
    },
  ) {
    return this.productService.createProduct(CreateProductDto.from(body));
  }
}
