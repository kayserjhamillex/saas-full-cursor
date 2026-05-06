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
exports.ModuleService = void 0;
const common_1 = require("@nestjs/common");
const module_repository_1 = require("../repositories/module.repository");
let ModuleService = class ModuleService {
    moduleRepository;
    constructor(moduleRepository) {
        this.moduleRepository = moduleRepository;
    }
    async updateModuleStatus(payload) {
        const tenantId = payload.tenantId?.trim();
        const moduleName = payload.moduleName?.trim();
        if (!tenantId || !moduleName || payload.isActive === undefined) {
            throw new common_1.BadRequestException('tenantId, moduleName e isActive son obligatorios');
        }
        await this.moduleRepository.upsert(tenantId, moduleName, payload.isActive);
        return {
            tenantId,
            moduleName,
            isActive: payload.isActive,
            event: payload.isActive ? 'modules_activated' : 'modules_deactivated',
        };
    }
    async validateModule(tenantId, moduleName) {
        const modules = await this.moduleRepository.listByTenant(tenantId);
        const module = modules.find((item) => item.module_name === moduleName);
        if (!module || !module.is_active) {
            throw new common_1.ForbiddenException('Modulo no habilitado para el tenant');
        }
        return {
            moduleName,
            isActive: true,
        };
    }
};
exports.ModuleService = ModuleService;
exports.ModuleService = ModuleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [module_repository_1.ModuleRepository])
], ModuleService);
//# sourceMappingURL=module.service.js.map