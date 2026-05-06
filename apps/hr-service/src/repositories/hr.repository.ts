/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { AttendanceEntity } from '../domain/attendance.entity';
import { EmployeeEntity } from '../domain/employee.entity';
import { EvaluationEntity } from '../domain/evaluation.entity';
import { PayrollEntity } from '../domain/payroll.entity';
import { TrainingEntity } from '../domain/training.entity';
import { DatabaseService } from '../services/database.service';

type EmployeeRow = {
  id: string;
  tenant_id: string;
  full_name: string;
  document_number: string;
  email: string;
  role_name: string;
  position: string;
  status: string;
  created_at: Date;
};

type AttendanceRow = {
  id: string;
  tenant_id: string;
  employee_id: string;
  check_in_at: Date;
  check_out_at: Date | null;
  status: string;
  notes: string | null;
  created_at: Date;
};

type EvaluationRow = {
  id: string;
  tenant_id: string;
  employee_id: string;
  evaluator_name: string;
  score: string;
  comments: string | null;
  evaluated_at: Date;
};

type PayrollRow = {
  id: string;
  tenant_id: string;
  employee_id: string;
  period_label: string;
  base_amount: string;
  bonus_amount: string;
  deduction_amount: string;
  net_amount: string;
  status: string;
  generated_at: Date;
};

type TrainingRow = {
  id: string;
  tenant_id: string;
  employee_id: string;
  title: string;
  provider: string;
  status: string;
  completed_at: Date | null;
  created_at: Date;
};

const EMPLOYEE_COLUMNS = `
  id, tenant_id, full_name, document_number, email, role_name, position, status, created_at
`;

const ATTENDANCE_COLUMNS = `
  id, tenant_id, employee_id, check_in_at, check_out_at, status, notes, created_at
`;

const EVALUATION_COLUMNS = `
  id, tenant_id, employee_id, evaluator_name, score, comments, evaluated_at
`;

const PAYROLL_COLUMNS = `
  id, tenant_id, employee_id, period_label, base_amount, bonus_amount, deduction_amount, net_amount, status, generated_at
`;

const TRAINING_COLUMNS = `
  id, tenant_id, employee_id, title, provider, status, completed_at, created_at
`;

const SELECT_EMPLOYEE_BY_ID_QUERY = `
  SELECT ${EMPLOYEE_COLUMNS}
  FROM employees
  WHERE id = $1 AND tenant_id = $2
  LIMIT 1
`;

const CREATE_EMPLOYEE_QUERY = `
  INSERT INTO employees (tenant_id, full_name, document_number, email, role_name, position, status, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
  RETURNING ${EMPLOYEE_COLUMNS}
`;

const CREATE_ATTENDANCE_QUERY = `
  INSERT INTO attendance (tenant_id, employee_id, check_in_at, check_out_at, status, notes, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, NOW())
  RETURNING ${ATTENDANCE_COLUMNS}
`;

const CREATE_EVALUATION_QUERY = `
  INSERT INTO employee_evaluations (tenant_id, employee_id, evaluator_name, score, comments, evaluated_at)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING ${EVALUATION_COLUMNS}
`;

const CREATE_PAYROLL_QUERY = `
  INSERT INTO payroll (tenant_id, employee_id, period_label, base_amount, bonus_amount, deduction_amount, net_amount, status, generated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
  RETURNING ${PAYROLL_COLUMNS}
`;

const CREATE_TRAINING_QUERY = `
  INSERT INTO trainings (tenant_id, employee_id, title, provider, status, completed_at, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, NOW())
  RETURNING ${TRAINING_COLUMNS}
`;

@Injectable()
export class HrRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findEmployeeById(
    employeeId: string,
    tenantId: string,
  ): Promise<EmployeeEntity | null> {
    const result = await this.databaseService
      .getPool()
      .query<EmployeeRow>(SELECT_EMPLOYEE_BY_ID_QUERY, [employeeId, tenantId]);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapEmployee(result.rows[0]);
  }

  async createEmployee(payload: {
    tenantId: string;
    fullName: string;
    documentNumber: string;
    email: string;
    roleName: string;
    position: string;
    status: string;
  }): Promise<EmployeeEntity> {
    const result = await this.databaseService
      .getPool()
      .query<EmployeeRow>(CREATE_EMPLOYEE_QUERY, [
        payload.tenantId,
        payload.fullName,
        payload.documentNumber,
        payload.email,
        payload.roleName,
        payload.position,
        payload.status,
      ]);
    return this.mapEmployee(result.rows[0]);
  }

  async createAttendance(payload: {
    tenantId: string;
    employeeId: string;
    checkInAt: string;
    checkOutAt: string | null;
    status: string;
    notes: string | null;
  }): Promise<AttendanceEntity> {
    const result = await this.databaseService
      .getPool()
      .query<AttendanceRow>(CREATE_ATTENDANCE_QUERY, [
        payload.tenantId,
        payload.employeeId,
        payload.checkInAt,
        payload.checkOutAt,
        payload.status,
        payload.notes,
      ]);
    return this.mapAttendance(result.rows[0]);
  }

  async createEvaluation(payload: {
    tenantId: string;
    employeeId: string;
    evaluatorName: string;
    score: number;
    comments: string | null;
    evaluatedAt: string;
  }): Promise<EvaluationEntity> {
    const result = await this.databaseService
      .getPool()
      .query<EvaluationRow>(CREATE_EVALUATION_QUERY, [
        payload.tenantId,
        payload.employeeId,
        payload.evaluatorName,
        payload.score,
        payload.comments,
        payload.evaluatedAt,
      ]);
    return this.mapEvaluation(result.rows[0]);
  }

  async createPayroll(payload: {
    tenantId: string;
    employeeId: string;
    periodLabel: string;
    baseAmount: number;
    bonusAmount: number;
    deductionAmount: number;
    netAmount: number;
    status: string;
  }): Promise<PayrollEntity> {
    const result = await this.databaseService
      .getPool()
      .query<PayrollRow>(CREATE_PAYROLL_QUERY, [
        payload.tenantId,
        payload.employeeId,
        payload.periodLabel,
        payload.baseAmount,
        payload.bonusAmount,
        payload.deductionAmount,
        payload.netAmount,
        payload.status,
      ]);
    return this.mapPayroll(result.rows[0]);
  }

  async createTraining(payload: {
    tenantId: string;
    employeeId: string;
    title: string;
    provider: string;
    status: string;
    completedAt: string | null;
  }): Promise<TrainingEntity> {
    const result = await this.databaseService
      .getPool()
      .query<TrainingRow>(CREATE_TRAINING_QUERY, [
        payload.tenantId,
        payload.employeeId,
        payload.title,
        payload.provider,
        payload.status,
        payload.completedAt,
      ]);
    return this.mapTraining(result.rows[0]);
  }

  private mapEmployee(row: EmployeeRow): EmployeeEntity {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      fullName: String(row.full_name),
      documentNumber: String(row.document_number),
      email: String(row.email),
      roleName: String(row.role_name),
      position: String(row.position),
      status: String(row.status),
      createdAt: row.created_at,
    };
  }

  private mapAttendance(row: AttendanceRow): AttendanceEntity {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      employeeId: String(row.employee_id),
      checkInAt: row.check_in_at,
      checkOutAt: row.check_out_at ?? null,
      status: String(row.status),
      notes: row.notes ?? null,
      createdAt: row.created_at,
    };
  }

  private mapEvaluation(row: EvaluationRow): EvaluationEntity {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      employeeId: String(row.employee_id),
      evaluatorName: String(row.evaluator_name),
      score: Number(row.score),
      comments: row.comments ?? null,
      evaluatedAt: row.evaluated_at,
    };
  }

  private mapPayroll(row: PayrollRow): PayrollEntity {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      employeeId: String(row.employee_id),
      periodLabel: String(row.period_label),
      baseAmount: Number(row.base_amount),
      bonusAmount: Number(row.bonus_amount),
      deductionAmount: Number(row.deduction_amount),
      netAmount: Number(row.net_amount),
      status: String(row.status),
      generatedAt: row.generated_at,
    };
  }

  private mapTraining(row: TrainingRow): TrainingEntity {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      employeeId: String(row.employee_id),
      title: String(row.title),
      provider: String(row.provider),
      status: String(row.status),
      completedAt: row.completed_at ?? null,
      createdAt: row.created_at,
    };
  }
}
