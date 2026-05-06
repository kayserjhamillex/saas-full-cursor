import { BadRequestException } from '@nestjs/common';

export class CreateAccountDto {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly accountType: string,
    public readonly currency: string,
    public readonly initialBalance: number | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    name?: string;
    accountType?: string;
    currency?: string;
    initialBalance?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();
    const accountType = payload.accountType?.trim();
    const currency = payload.currency?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }
    if (!accountType) {
      throw new BadRequestException('accountType es obligatorio');
    }
    if (!currency) {
      throw new BadRequestException('currency es obligatorio');
    }

    return new CreateAccountDto(
      tenantId,
      name,
      accountType,
      currency,
      payload.initialBalance,
    );
  }
}
