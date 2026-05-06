import { Pool } from 'pg';
import { AttendanceEntity } from '../domain/attendance.entity';
import { EmployeeEntity } from '../domain/employee.entity';
import { EvaluationEntity } from '../domain/evaluation.entity';
import { PayrollEntity } from '../domain/payroll.entity';
import { TrainingEntity } from '../domain/training.entity';
import { DatabaseService } from '../services/database.service';
export declare class HrRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    getPool(): Pool;
    findEmployeeById(employeeId: string, tenantId: string): Promise<EmployeeEntity | null>;
    createEmployee(payload: {
        tenantId: string;
        fullName: string;
        documentNumber: string;
        email: string;
        roleName: string;
        position: string;
        status: string;
    }): Promise<EmployeeEntity>;
    createAttendance(payload: {
        tenantId: string;
        employeeId: string;
        checkInAt: string;
        checkOutAt: string | null;
        status: string;
        notes: string | null;
    }): Promise<AttendanceEntity>;
    createEvaluation(payload: {
        tenantId: string;
        employeeId: string;
        evaluatorName: string;
        score: number;
        comments: string | null;
        evaluatedAt: string;
    }): Promise<EvaluationEntity>;
    createPayroll(payload: {
        tenantId: string;
        employeeId: string;
        periodLabel: string;
        baseAmount: number;
        bonusAmount: number;
        deductionAmount: number;
        netAmount: number;
        status: string;
    }): Promise<PayrollEntity>;
    createTraining(payload: {
        tenantId: string;
        employeeId: string;
        title: string;
        provider: string;
        status: string;
        completedAt: string | null;
    }): Promise<TrainingEntity>;
    private mapEmployee;
    private mapAttendance;
    private mapEvaluation;
    private mapPayroll;
    private mapTraining;
}
