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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const saas_validation_service_1 = require("../services/saas-validation.service");
const tenant_service_1 = require("../services/tenant.service");
let TenantController = class TenantController {
    tenantService;
    saasValidationService;
    constructor(tenantService, saasValidationService) {
        this.tenantService = tenantService;
        this.saasValidationService = saasValidationService;
    }
    createTenant(body) {
        return this.tenantService.createTenant(body);
    }
    getTenant(tenantId) {
        return this.tenantService.getTenantById(tenantId);
    }
    validateTenantAccess(tenantId, moduleName) {
        return this.saasValidationService.validateTenantAccess(tenantId, moduleName);
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "createTenant", null);
__decorate([
    (0, common_1.Get)(':tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "getTenant", null);
__decorate([
    (0, common_1.Get)('internal/:tenantId/validate'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Query)('module')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TenantController.prototype, "validateTenantAccess", null);
exports.TenantController = TenantController = __decorate([
    (0, common_1.Controller)('tenants'),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        saas_validation_service_1.SaaSValidationService])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map