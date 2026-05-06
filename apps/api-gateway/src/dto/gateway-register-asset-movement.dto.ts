import { BadRequestException } from '@nestjs/common';

export class GatewayRegisterAssetMovementDto {
  constructor(
    public readonly tenantId: string,
    public readonly assetId: string,
    public readonly movementType: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    assetId?: string;
    movementType?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const movementType = payload.movementType?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!assetId) {
      throw new BadRequestException('assetId es obligatorio');
    }
    if (!movementType) {
      throw new BadRequestException('movementType es obligatorio');
    }
    return new GatewayRegisterAssetMovementDto(tenantId, assetId, movementType);
  }
}
