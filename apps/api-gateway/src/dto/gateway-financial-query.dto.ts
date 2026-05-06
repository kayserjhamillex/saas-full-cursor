import { BadRequestException } from '@nestjs/common';

export class GatewayFinancialQueryDto {
  constructor(public readonly tenantId: string) {}

  static from(payload: { tenantId?: string }) {
    const tenantId = payload.tenantId?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    return new GatewayFinancialQueryDto(tenantId);
  }
}
