"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let HrRepository = class HrRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    getPool() {
        return this.databaseService.getPool();
    }
    async findEmployeeById(employeeId, tenantId) {
        const result = await this.databaseService.getPool().query(`SELECT id, tenant_id, full_name, document_number, email, role_name, position, status, created_at
       FROM employees
       WHERE id = $1 AND tenant_id = $2
       LIMIT 1`, [employeeId, tenantId]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapEmployee(result.rows[0]);
    }
    async createEmployee(payload) {
        const result = await this.databaseService.getPool().query(`INSERT INTO employees (tenant_id, full_name, document_number, email, role_name, position, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING id, tenant_id, full_name, document_number, email, role_name, position, status, created_at`, [
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
    async createAttendance(payload) {
        const result = await this.databaseService.getPool().query(`INSERT INTO attendance (tenant_id, employee_id, check_in_at, check_out_at, status, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, tenant_id, employee_id, check_in_at, check_out_at, status, notes, created_at`, [
            payload.tenantId,
            payload.employeeId,
            payload.checkInAt,
            payload.checkOutAt,
            payload.status,
            payload.notes,
        ]);
        return this.mapAttendance(result.rows[0]);
    }
    async createEvaluation(payload) {
        const result = await this.databaseService.getPool().query(`INSERT INTO employee_evaluations (tenant_id, employee_id, evaluator_name, score, comments, evaluated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, tenant_id, employee_id, evaluator_name, score, comments, evaluated_at`, [
            payload.tenantId,
            payload.employeeId,
            payload.evaluatorName,
            payload.score,
            payload.comments,
            payload.evaluatedAt,
        ]);
        return this.mapEvaluation(result.rows[0]);
    }
    async createPayroll(payload) {
        const result = await this.databaseService.getPool().query(`INSERT INTO payroll (tenant_id, employee_id, period_label, base_amount, bonus_amount, deduction_amount, net_amount, status, generated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id, tenant_id, employee_id, period_label, base_amount, bonus_amount, deduction_amount, net_amount, status, generated_at`, [
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
    async createTraining(payload) {
        const result = await this.databaseService.getPool().query(`INSERT INTO trainings (tenant_id, employee_id, title, provider, status, completed_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id, tenant_id, employee_id, title, provider, status, completed_at, created_at`, [
            payload.tenantId,
            payload.employeeId,
            payload.title,
            payload.provider,
            payload.status,
            payload.completedAt,
        ]);
        return this.mapTraining(result.rows[0]);
    }
    mapEmployee(row) {
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
    mapAttendance(row) {
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
    mapEvaluation(row) {
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
    mapPayroll(row) {
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
    mapTraining(row) {
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
};
exports.HrRepository = HrRepository;
exports.HrRepository = HrRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], HrRepository);
//# sourceMappingURL=hr.repository.js.map