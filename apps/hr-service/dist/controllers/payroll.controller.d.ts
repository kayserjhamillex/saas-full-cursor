import { PayrollService } from '../services/payroll.service';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    generate(body: {
        tenantId?: string;
        employeeId?: string;
        periodLabel?: string;
        baseAmount?: number;
        bonusAmount?: number;
        deductionAmount?: number;
        status?: string;
    }): Promise<{
        payroll: import("../domain/payroll.entity").PayrollEntity;
        event: string;
    }>;
}
