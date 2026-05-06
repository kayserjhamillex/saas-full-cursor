import { BadRequestException } from '@nestjs/common';

type TransactionType = 'income' | 'expense';

export class ListTransactionsQueryDto {
  constructor(
    public readonly tenantId: string,
    public readonly accountId: string | undefined,
    public readonly transactionType: TransactionType | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    accountId?: string;
    transactionType?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }

    let transactionType: TransactionType | undefined;
    if (payload.transactionType !== undefined) {
      const normalizedType = payload.transactionType.trim();
      if (!normalizedType) {
        throw new BadRequestException('transactionType es obligatorio');
      }
      if (normalizedType !== 'income' && normalizedType !== 'expense') {
        throw new BadRequestException(
          'transactionType debe ser income o expense',
        );
      }
      transactionType = normalizedType;
    }

    return new ListTransactionsQueryDto(
      tenantId,
      payload.accountId?.trim(),
      transactionType,
    );
  }
}
