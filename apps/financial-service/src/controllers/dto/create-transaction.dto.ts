import { BadRequestException } from '@nestjs/common';

type TransactionType = 'income' | 'expense';

export class CreateTransactionDto {
  constructor(
    public readonly tenantId: string,
    public readonly accountId: string,
    public readonly transactionType: TransactionType,
    public readonly amount: number,
    public readonly sourceModule: string | undefined,
    public readonly reference: string | undefined,
    public readonly notes: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    accountId?: string;
    transactionType?: TransactionType;
    amount?: number;
    sourceModule?: string;
    reference?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const accountId = payload.accountId?.trim();
    const transactionType = payload.transactionType?.trim();
    const amount = payload.amount;

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!accountId) {
      throw new BadRequestException('accountId es obligatorio');
    }
    if (!transactionType) {
      throw new BadRequestException('transactionType es obligatorio');
    }
    if (transactionType !== 'income' && transactionType !== 'expense') {
      throw new BadRequestException(
        'transactionType debe ser income o expense',
      );
    }
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
      throw new BadRequestException('amount debe ser mayor a 0');
    }

    return new CreateTransactionDto(
      tenantId,
      accountId,
      transactionType,
      amount,
      payload.sourceModule?.trim(),
      payload.reference?.trim(),
      payload.notes?.trim(),
    );
  }
}
