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
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const hr_repository_1 = require("../repositories/hr.repository");
let EmployeeService = class EmployeeService {
    hrRepository;
    constructor(hrRepository) {
        this.hrRepository = hrRepository;
    }
    async createEmployee(payload) {
        const tenantId = payload.tenantId?.trim();
        const fullName = payload.fullName?.trim();
        const documentNumber = payload.documentNumber?.trim();
        const email = payload.email?.trim();
        const roleName = payload.roleName?.trim();
        const position = payload.position?.trim();
        const status = payload.status?.trim() ?? 'active';
        if (!tenantId || !fullName || !documentNumber || !email || !roleName || !position) {
            throw new common_1.BadRequestException('tenantId, fullName, documentNumber, email, roleName y position son obligatorios');
        }
        const employee = await this.hrRepository.createEmployee({
            tenantId,
            fullName,
            documentNumber,
            email,
            roleName,
            position,
            status,
        });
        return {
            employee,
            event: 'employee_created',
        };
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hr_repository_1.HrRepository])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map