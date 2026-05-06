import { BadRequestException } from '@nestjs/common';

export class GatewayTransferStockDto {
  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly fromWarehouseId: string,
    public readonly toWarehouseId: string,
    public readonly quantity: number,
  ) {}

  static from(payload: {
    tenantId?: string;
    productId?: string;
    fromWarehouseId?: string;
    toWarehouseId?: string;
    quantity?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const productId = payload.productId?.trim();
    const fromWarehouseId = payload.fromWarehouseId?.trim();
    const toWarehouseId = payload.toWarehouseId?.trim();
    const quantity = payload.quantity;
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!productId) {
      throw new BadRequestException('productId es obligatorio');
    }
    if (!fromWarehouseId) {
      throw new BadRequestException('fromWarehouseId es obligatorio');
    }
    if (!toWarehouseId) {
      throw new BadRequestException('toWarehouseId es obligatorio');
    }
    if (
      typeof quantity !== 'number' ||
      Number.isNaN(quantity) ||
      quantity <= 0
    ) {
      throw new BadRequestException('quantity debe ser mayor a 0');
    }
    return new GatewayTransferStockDto(
      tenantId,
      productId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
    );
  }
}
