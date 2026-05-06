import { TransactionService } from '../services/transaction.service';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    create(body: {
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
    list(tenantId: string | undefined, accountId: string | undefined, transactionType: string | undefined): Promise<{
        tenantId: string;
        total: any;
        transactions: any;
    }>;
}
