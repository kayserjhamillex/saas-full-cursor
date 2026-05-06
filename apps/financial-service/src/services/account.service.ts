import { BadRequestException, Injectable } from '@nestjs/common';
import { FinancialRepository } from '../repositories/financial.repository';

@Injectable()
export class AccountService {
  constructor(private readonly financialRepository: FinancialRepository) {}

  async createAccount(payload: {
    tenantId?: string;
    name?: string;
    accountType?: string;
    currency?: string;
    initialBalance?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();
    const accountType = payload.accountType?.trim() ?? 'cash';
    const currency = payload.currency?.trim() ?? 'PEN';
    const initialBalance = Number(payload.initialBalance ?? 0);

    if (!tenantId || !name) {
      throw new BadRequestException('tenantId y name son obligatorios');
    }
    if (Number.isNaN(initialBalance)) {
      throw new BadRequestException('initialBalance debe ser numerico');
    }

    const account = await this.financialRepository.createAccount({
      tenantId,
      name,
      accountType,
      currency,
      initialBalance,
    });

    return {
      account,
      event: 'financial_account_created',
    };
  }

  async listAccounts(tenantId?: string) {
    const cleanTenantId = tenantId?.trim();
    if (!cleanTenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    const accounts = await this.financialRepository.getAccountsByTenant(cleanTenantId);
    return {
      tenantId: cleanTenantId,
      accounts,
      total: accounts.length,
    };
  }
}
