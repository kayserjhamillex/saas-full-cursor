import { BadRequestException } from '@nestjs/common';

export class GatewayRegisterAssetDepreciationDto {
  constructor(
    public readonly tenantId: string,
    public readonly assetId: string,
    public readonly amount: number,
  ) {}

  static from(payload: {
    tenantId?: string;
    assetId?: string;
    amount?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const amount = payload.amount;
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!assetId) {
      throw new BadRequestException('assetId es obligatorio');
    }
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
      throw new BadRequestException('amount debe ser mayor a 0');
    }
    return new GatewayRegisterAssetDepreciationDto(tenantId, assetId, amount);
  }
}
