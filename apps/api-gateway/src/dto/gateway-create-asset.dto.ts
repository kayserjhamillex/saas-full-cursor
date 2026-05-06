import { BadRequestException } from '@nestjs/common';

export class GatewayCreateAssetDto {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly code: string,
  ) {}

  static from(payload: { tenantId?: string; name?: string; code?: string }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();
    const code = payload.code?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }
    if (!code) {
      throw new BadRequestException('code es obligatorio');
    }
    return new GatewayCreateAssetDto(tenantId, name, code);
  }
}
