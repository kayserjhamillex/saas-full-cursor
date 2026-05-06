import { FinancialRepository } from '../repositories/financial.repository';
export declare class TransactionService {
    private readonly financialRepository;
    constructor(financialRepository: FinancialRepository);
    registerTransaction(payload: {
        tenantId?: string;
        accountId?: string;
        transactionType?: 'income' | 'expense';
        amount?: number;
        sourceModule?: string;
        reference?: string;
        notes?: string;
    }): Promise<{
        transaction: {
            id: string;
            tenantId: string;
            accountId: string;
            transactionType: string;
            amount: number;
            sourceModule: string;
            reference: string | null;
            notes: string | null;
            transactionDate: Date;
            createdAt: Date;
        };
        detail: any;
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
    listTransactions(payload: {
        tenantId?: string;
        accountId?: string;
        transactionType?: string;
    }): Promise<{
        tenantId: string;
        total: any;
        transactions: any;
    }>;
}
