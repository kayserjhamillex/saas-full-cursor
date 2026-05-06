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
exports.EvaluationService = void 0;
const common_1 = require("@nestjs/common");
const hr_repository_1 = require("../repositories/hr.repository");
let EvaluationService = class EvaluationService {
    hrRepository;
    constructor(hrRepository) {
        this.hrRepository = hrRepository;
    }
    async createEvaluation(payload) {
        const tenantId = payload.tenantId?.trim();
        const employeeId = payload.employeeId?.trim();
        const evaluatorName = payload.evaluatorName?.trim();
        const score = Number(payload.score ?? 0);
        const comments = payload.comments?.trim() ?? null;
        const evaluatedAt = payload.evaluatedAt?.trim() ?? new Date().toISOString();
        if (!tenantId || !employeeId || !evaluatorName) {
            throw new common_1.BadRequestException('tenantId, employeeId y evaluatorName son obligatorios');
        }
        if (score < 0 || score > 100) {
            throw new common_1.BadRequestException('score debe estar entre 0 y 100');
        }
        const employee = await this.hrRepository.findEmployeeById(employeeId, tenantId);
        if (!employee) {
            throw new common_1.BadRequestException('Evaluacion invalida: empleado no existe en el tenant');
        }
        const evaluation = await this.hrRepository.createEvaluation({
            tenantId,
            employeeId,
            evaluatorName,
            score,
            comments,
            evaluatedAt,
        });
        return {
            evaluation,
            event: 'evaluation_completed',
        };
    }
};
exports.EvaluationService = EvaluationService;
exports.EvaluationService = EvaluationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hr_repository_1.HrRepository])
], EvaluationService);
//# sourceMappingURL=evaluation.service.js.map