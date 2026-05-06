/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Tipos inferidos desde repositorio SQL legacy */
import { BadRequestException, Injectable } from '@nestjs/common';
import { FinancialRepository } from '../repositories/financial.repository';
import { TransactionRunnerService } from './transaction-runner.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly financialRepository: FinancialRepository,
    private readonly transactionRunnerService: TransactionRunnerService,
  ) {}

  async registerTransaction(payload: {
    tenantId?: string;
    accountId?: string;
    transactionType?: 'income' | 'expense';
    amount?: number;
    sourceModule?: string;
    reference?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const accountId = payload.accountId?.trim();
    const transactionType = payload.transactionType;
    const amount = Number(payload.amount ?? 0);
    const sourceModule = payload.sourceModule?.trim() ?? 'manual';
    const reference = payload.reference?.trim() ?? null;
    const notes = payload.notes?.trim() ?? null;

    if (!tenantId || !accountId || !transactionType) {
      throw new BadRequestException(
        'tenantId, accountId y transactionType son obligatorios',
      );
    }
    if (transactionType !== 'income' && transactionType !== 'expense') {
      throw new BadRequestException(
        'transactionType debe ser income o expense',
      );
    }
    if (amount <= 0 || Number.isNaN(amount)) {
      throw new BadRequestException('amount debe ser mayor a 0');
    }

    return this.transactionRunnerService.runInTransaction(async (client) => {
      const account = await this.financialRepository.findAccountByIdForUpdate(
        accountId,
        tenantId,
        client,
      );
      if (!account) {
        throw new BadRequestException(
          'Cuenta financiera no encontrada en el tenant',
        );
      }

      const delta = transactionType === 'income' ? amount : -amount;
      const nextBalance = account.currentBalance + delta;
      if (nextBalance < 0) {
        throw new BadRequestException(
          'Saldo insuficiente para registrar egreso',
        );
      }

      const updatedAccount =
        await this.financialRepository.updateAccountBalance(
          account.id,
          nextBalance,
          client,
        );
      const transaction = await this.financialRepository.createTransaction(
        client,
        {
          tenantId,
          accountId,
          transactionType,
          amount,
          sourceModule,
          reference,
          notes,
        },
      );
      const detail = await this.financialRepository.createTransactionDetail(
        client,
        {
          transactionId: transaction.id,
          accountId,
          entryType: transactionType === 'income' ? 'credit' : 'debit',
          amount,
          description:
            transactionType === 'income'
              ? 'Registro de ingreso en cuenta financiera'
              : 'Registro de egreso en cuenta financiera',
        },
      );

      return {
        transaction,
        detail,
        account: updatedAccount,
        event:
          transactionType === 'income'
            ? 'income_registered'
            : 'expense_registered',
      };
    });
  }

  async listTransactions(payload: {
    tenantId?: string;
    accountId?: string;
    transactionType?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    const accountId = payload.accountId?.trim();
    const transactionType = payload.transactionType?.trim();
    const transactions = await this.financialRepository.getTransactionsByTenant(
      tenantId,
      accountId,
      transactionType,
    );

    return {
      tenantId,
      total: transactions.length,
      transactions,
    };
  }
}
