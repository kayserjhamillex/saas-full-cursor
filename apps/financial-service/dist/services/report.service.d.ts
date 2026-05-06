import { FinancialRepository } from '../repositories/financial.repository';
export declare class ReportService {
    private readonly financialRepository;
    constructor(financialRepository: FinancialRepository);
    getCashFlow(tenantId?: string): Promise<{
        tenantId: string;
        reportGeneratedAt: string;
        accountsCount: any;
        transactionsCount: any;
        totalIncome: any;
        totalExpense: any;
        netCashFlow: number;
        event: string;
    }>;
}
