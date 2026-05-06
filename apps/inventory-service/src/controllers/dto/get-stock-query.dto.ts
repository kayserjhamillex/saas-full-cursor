import { BadRequestException } from '@nestjs/common';

export class GetStockQueryDto {
  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly warehouseId: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    productId?: string;
    warehouseId?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const productId = payload.productId?.trim();
    const warehouseId = payload.warehouseId?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!productId) {
      throw new BadRequestException('productId es obligatorio');
    }
    if (!warehouseId) {
      throw new BadRequestException('warehouseId es obligatorio');
    }

    return new GetStockQueryDto(tenantId, productId, warehouseId);
  }
}
