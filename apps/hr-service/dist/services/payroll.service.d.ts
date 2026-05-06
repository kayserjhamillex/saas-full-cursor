import { HrRepository } from '../repositories/hr.repository';
export declare class PayrollService {
    private readonly hrRepository;
    constructor(hrRepository: HrRepository);
    generatePayroll(payload: {
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
