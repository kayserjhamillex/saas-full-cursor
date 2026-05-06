import { BadRequestException } from '@nestjs/common';

export class GatewayCreateFinancialTransactionDto {
  constructor(
    public readonly tenantId: string,
    public readonly accountId: string,
    public readonly amount: number,
  ) {}

  static from(payload: {
    tenantId?: string;
    accountId?: string;
    amount?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const accountId = payload.accountId?.trim();
    const amount = payload.amount;
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!accountId) {
      throw new BadRequestException('accountId es obligatorio');
    }
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
      throw new BadRequestException('amount debe ser mayor a 0');
    }
    return new GatewayCreateFinancialTransactionDto(
      tenantId,
      accountId,
      amount,
    );
  }
}
