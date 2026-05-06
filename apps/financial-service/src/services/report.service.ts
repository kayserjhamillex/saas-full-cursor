import { BadRequestException, Injectable } from '@nestjs/common';
import { FinancialRepository } from '../repositories/financial.repository';

@Injectable()
export class ReportService {
  constructor(private readonly financialRepository: FinancialRepository) {}

  async getCashFlow(tenantId?: string) {
    const cleanTenantId = tenantId?.trim();
    if (!cleanTenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }

    const transactions = await this.financialRepository.getTransactionsByTenant(cleanTenantId);
    const accounts = await this.financialRepository.getAccountsByTenant(cleanTenantId);

    const totals = transactions.reduce(
      (acc, tx) => {
        if (tx.transactionType === 'income') {
          acc.totalIncome += tx.amount;
        } else if (tx.transactionType === 'expense') {
          acc.totalExpense += tx.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 },
    );

    const balance = totals.totalIncome - totals.totalExpense;

    return {
      tenantId: cleanTenantId,
      reportGeneratedAt: new Date().toISOString(),
      accountsCount: accounts.length,
      transactionsCount: transactions.length,
      totalIncome: totals.totalIncome,
      totalExpense: totals.totalExpense,
      netCashFlow: balance,
      event: 'report_generated',
    };
  }
}
