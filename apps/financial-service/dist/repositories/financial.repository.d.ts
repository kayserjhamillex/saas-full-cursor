import { PoolClient } from 'pg';
import { DatabaseService } from '../services/database.service';
export declare class FinancialRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    getPool(): any;
    createAccount(payload: {
        tenantId: string;
        name: string;
        accountType: string;
        currency: string;
        initialBalance: number;
    }): Promise<{
        id: string;
        tenantId: string;
        name: string;
        accountType: string;
        currency: string;
        currentBalance: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    getAccountsByTenant(tenantId: string): Promise<any>;
    findAccountByIdForUpdate(accountId: string, tenantId: string, client: PoolClient): Promise<{
        id: string;
        tenantId: string;
        name: string;
        accountType: string;
        currency: string;
        currentBalance: number;
        isActive: boolean;
        createdAt: Date;
    } | null>;
    updateAccountBalance(accountId: string, nextBalance: number, client: PoolClient): Promise<{
        id: string;
        tenantId: string;
        name: string;
        accountType: string;
        currency: string;
        currentBalance: number;
        isActive: boolean;
        createdAt: Date;
    }>;
    createTransaction(client: PoolClient, payload: {
        tenantId: string;
        accountId: string;
        transactionType: 'income' | 'expense';
        amount: number;
        sourceModule: string;
        reference: string | null;
        notes: string | null;
    }): Promise<{
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
    }>;
    createTransactionDetail(client: PoolClient, payload: {
        transactionId: string;
        accountId: string;
        entryType: 'debit' | 'credit';
        amount: number;
        description: string;
    }): Promise<any>;
    getTransactionsByTenant(tenantId: string, accountId?: string, transactionType?: string): Promise<any>;
    private mapAccount;
    private mapTransaction;
}
