import { ReportService } from '../services/report.service';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    getCashFlow(tenantId: string | undefined): Promise<{
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
