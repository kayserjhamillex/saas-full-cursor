import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(payload: {
    tenantId?: string;
    categoryId?: string;
    subcategoryId?: string;
    sku?: string;
    name?: string;
    unit?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const categoryId = payload.categoryId?.trim();
    const subcategoryId = payload.subcategoryId?.trim();
    const sku = payload.sku?.trim();
    const name = payload.name?.trim();
    const unit = payload.unit?.trim() ?? 'unidad';

    if (!tenantId || !categoryId || !sku || !name) {
      throw new BadRequestException(
        'tenantId, categoryId, sku y name son obligatorios',
      );
    }

    const categoryExists = await this.productRepository.categoryExists(tenantId, categoryId);
    if (!categoryExists) {
      throw new BadRequestException('La categoria no existe para el tenant');
    }

    const product = await this.productRepository.create({
      tenantId,
      categoryId,
      subcategoryId,
      sku,
      name,
      unit,
    });

    return {
      product,
      event: 'product_created',
    };
  }
}
