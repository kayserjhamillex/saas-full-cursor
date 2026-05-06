import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { StockRepository } from '../repositories/stock.repository';

@Injectable()
export class StockService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  async getStock(payload: {
    tenantId?: string;
    productId?: string;
    warehouseId?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const productId = payload.productId?.trim();
    const warehouseId = payload.warehouseId?.trim();

    if (!tenantId || !productId || !warehouseId) {
      throw new BadRequestException(
        'tenantId, productId y warehouseId son obligatorios',
      );
    }

    const product = await this.productRepository.findByIdAndTenant(productId, tenantId);
    if (!product) {
      throw new BadRequestException('Producto no encontrado en el tenant');
    }

    const stock = await this.stockRepository.findStock(tenantId, productId, warehouseId);
    return {
      tenantId,
      productId,
      warehouseId,
      quantity: stock?.quantity ?? 0,
      updatedAt: stock?.updatedAt ?? null,
    };
  }
}
