import { BadRequestException } from '@nestjs/common';

export class GatewayCreateFinancialAccountDto {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly accountType: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    name?: string;
    accountType?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();
    const accountType = payload.accountType?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }
    if (!accountType) {
      throw new BadRequestException('accountType es obligatorio');
    }
    return new GatewayCreateFinancialAccountDto(tenantId, name, accountType);
  }
}
