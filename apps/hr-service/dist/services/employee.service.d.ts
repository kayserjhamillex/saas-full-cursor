import { HrRepository } from '../repositories/hr.repository';
export declare class EmployeeService {
    private readonly hrRepository;
    constructor(hrRepository: HrRepository);
    createEmployee(payload: {
        tenantId?: string;
        fullName?: string;
        documentNumber?: string;
        email?: string;
        roleName?: string;
        position?: string;
        status?: string;
    }): Promise<{
        employee: import("../domain/employee.entity").EmployeeEntity;
        event: string;
    }>;
}
