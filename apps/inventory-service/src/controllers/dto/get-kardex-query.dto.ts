import { BadRequestException } from '@nestjs/common';

export class GetKardexQueryDto {
  constructor(
    public readonly tenantId: string,
    public readonly productId: string,
    public readonly warehouseId: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    productId?: string;
    warehouseId?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const productId = payload.productId?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!productId) {
      throw new BadRequestException('productId es obligatorio');
    }

    return new GetKardexQueryDto(
      tenantId,
      productId,
      payload.warehouseId?.trim(),
    );
  }
}
