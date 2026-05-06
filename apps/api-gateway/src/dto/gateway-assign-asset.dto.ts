import { BadRequestException } from '@nestjs/common';

export class GatewayAssignAssetDto {
  constructor(
    public readonly tenantId: string,
    public readonly assetId: string,
    public readonly employeeId: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    assetId?: string;
    employeeId?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const employeeId = payload.employeeId?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!assetId) {
      throw new BadRequestException('assetId es obligatorio');
    }
    if (!employeeId) {
      throw new BadRequestException('employeeId es obligatorio');
    }
    return new GatewayAssignAssetDto(tenantId, assetId, employeeId);
  }
}
