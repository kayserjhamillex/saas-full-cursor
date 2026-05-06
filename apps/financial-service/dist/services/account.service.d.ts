import { FinancialRepository } from '../repositories/financial.repository';
export declare class AccountService {
    private readonly financialRepository;
    constructor(financialRepository: FinancialRepository);
    createAccount(payload: {
        tenantId?: string;
        name?: string;
        accountType?: string;
        currency?: string;
        initialBalance?: number;
    }): Promise<{
        account: {
            id: string;
            tenantId: string;
            name: string;
            accountType: string;
            currency: string;
            currentBalance: number;
            isActive: boolean;
            createdAt: Date;
        };
        event: string;
    }>;
    listAccounts(tenantId?: string): Promise<{
        tenantId: string;
        accounts: any;
        total: any;
    }>;
}
