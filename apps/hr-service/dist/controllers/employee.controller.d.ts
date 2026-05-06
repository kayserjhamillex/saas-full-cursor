import { EmployeeService } from '../services/employee.service';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    createEmployee(body: {
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
