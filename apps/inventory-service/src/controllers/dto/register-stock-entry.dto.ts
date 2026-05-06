import { BadRequestException } from '@nestjs/common';

export class RegisterStockEntryDto {
  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly warehouseId: string,
    public readonly quantity: number,
    public readonly reference: string | undefined,
    public readonly notes: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    productId?: string;
    warehouseId?: string;
    quantity?: number;
    reference?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const productId = payload.productId?.trim();
    const warehouseId = payload.warehouseId?.trim();
    const quantity = payload.quantity;

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!productId) {
      throw new BadRequestException('productId es obligatorio');
    }
    if (!warehouseId) {
      throw new BadRequestException('warehouseId es obligatorio');
    }
    if (
      typeof quantity !== 'number' ||
      Number.isNaN(quantity) ||
      quantity <= 0
    ) {
      throw new BadRequestException('quantity debe ser mayor a 0');
    }

    return new RegisterStockEntryDto(
      tenantId,
      productId,
      warehouseId,
      quantity,
      payload.reference?.trim(),
      payload.notes?.trim(),
    );
  }
}
