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
exports.TrainingService = void 0;
const common_1 = require("@nestjs/common");
const hr_repository_1 = require("../repositories/hr.repository");
let TrainingService = class TrainingService {
    hrRepository;
    constructor(hrRepository) {
        this.hrRepository = hrRepository;
    }
    async createTraining(payload) {
        const tenantId = payload.tenantId?.trim();
        const employeeId = payload.employeeId?.trim();
        const title = payload.title?.trim();
        const provider = payload.provider?.trim();
        const status = payload.status?.trim() ?? 'scheduled';
        const completedAt = payload.completedAt?.trim() ?? null;
        if (!tenantId || !employeeId || !title || !provider) {
            throw new common_1.BadRequestException('tenantId, employeeId, title y provider son obligatorios');
        }
        const employee = await this.hrRepository.findEmployeeById(employeeId, tenantId);
        if (!employee) {
            throw new common_1.BadRequestException('Capacitacion invalida: empleado no existe en el tenant');
        }
        const training = await this.hrRepository.createTraining({
            tenantId,
            employeeId,
            title,
            provider,
            status,
            completedAt,
        });
        return {
            training,
            event: 'training_registered',
        };
    }
};
exports.TrainingService = TrainingService;
exports.TrainingService = TrainingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hr_repository_1.HrRepository])
], TrainingService);
//# sourceMappingURL=training.service.js.map