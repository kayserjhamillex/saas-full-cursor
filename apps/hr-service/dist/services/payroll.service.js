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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const hr_repository_1 = require("../repositories/hr.repository");
let PayrollService = class PayrollService {
    hrRepository;
    constructor(hrRepository) {
        this.hrRepository = hrRepository;
    }
    async generatePayroll(payload) {
        const tenantId = payload.tenantId?.trim();
        const employeeId = payload.employeeId?.trim();
        const periodLabel = payload.periodLabel?.trim();
        const baseAmount = Number(payload.baseAmount ?? 0);
        const bonusAmount = Number(payload.bonusAmount ?? 0);
        const deductionAmount = Number(payload.deductionAmount ?? 0);
        const status = payload.status?.trim() ?? 'generated';
        const netAmount = baseAmount + bonusAmount - deductionAmount;
        if (!tenantId || !employeeId || !periodLabel) {
            throw new common_1.BadRequestException('tenantId, employeeId y periodLabel son obligatorios');
        }
        if (baseAmount <= 0) {
            throw new common_1.BadRequestException('baseAmount debe ser mayor a 0');
        }
        if (netAmount < 0) {
            throw new common_1.BadRequestException('La planilla no puede generar netAmount negativo');
        }
        const employee = await this.hrRepository.findEmployeeById(employeeId, tenantId);
        if (!employee) {
            throw new common_1.BadRequestException('No se puede generar planilla para un empleado inexistente');
        }
        const payroll = await this.hrRepository.createPayroll({
            tenantId,
            employeeId,
            periodLabel,
            baseAmount,
            bonusAmount,
            deductionAmount,
            netAmount,
            status,
        });
        return {
            payroll,
            event: 'payroll_generated',
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hr_repository_1.HrRepository])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map