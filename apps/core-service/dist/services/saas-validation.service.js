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
exports.SaaSValidationService = void 0;
const common_1 = require("@nestjs/common");
const module_service_1 = require("./module.service");
const subscription_service_1 = require("./subscription.service");
const tenant_service_1 = require("./tenant.service");
let SaaSValidationService = class SaaSValidationService {
    tenantService;
    subscriptionService;
    moduleService;
    constructor(tenantService, subscriptionService, moduleService) {
        this.tenantService = tenantService;
        this.subscriptionService = subscriptionService;
        this.moduleService = moduleService;
    }
    async validateTenantAccess(tenantId, moduleName) {
        const sanitizedTenantId = tenantId.trim();
        if (!sanitizedTenantId) {
            throw new common_1.BadRequestException('tenantId es obligatorio');
        }
        const tenant = await this.tenantService.getTenantById(sanitizedTenantId);
        if (tenant.status !== 'active') {
            throw new common_1.ForbiddenException('Tenant inactivo');
        }
        const subscription = await this.subscriptionService.ensureTenantHasActiveSubscription(sanitizedTenantId);
        const moduleValidation = moduleName
            ? await this.moduleService.validateModule(sanitizedTenantId, moduleName)
            : null;
        return {
            tenantId: tenant.id,
            tenantStatus: tenant.status,
            subscriptionId: subscription.id,
            subscriptionActive: true,
            module: moduleValidation,
            valid: true,
        };
    }
};
exports.SaaSValidationService = SaaSValidationService;
exports.SaaSValidationService = SaaSValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        subscription_service_1.SubscriptionService,
        module_service_1.ModuleService])
], SaaSValidationService);
//# sourceMappingURL=saas-validation.service.js.map