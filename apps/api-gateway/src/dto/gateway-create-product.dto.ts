import { BadRequestException } from '@nestjs/common';

export class GatewayCreateProductDto {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly sku: string,
  ) {}

  static from(payload: { tenantId?: string; name?: string; sku?: string }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();
    const sku = payload.sku?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }
    if (!sku) {
      throw new BadRequestException('sku es obligatorio');
    }
    return new GatewayCreateProductDto(tenantId, name, sku);
  }
}
