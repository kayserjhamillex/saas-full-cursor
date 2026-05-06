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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const subscription_repository_1 = require("../repositories/subscription.repository");
const tenant_repository_1 = require("../repositories/tenant.repository");
const module_repository_1 = require("../repositories/module.repository");
let SubscriptionService = class SubscriptionService {
    subscriptionRepository;
    tenantRepository;
    moduleRepository;
    constructor(subscriptionRepository, tenantRepository, moduleRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.tenantRepository = tenantRepository;
        this.moduleRepository = moduleRepository;
    }
    async createSubscription(payload) {
        const tenantId = payload.tenantId?.trim();
        const plan = payload.plan?.trim();
        const durationDays = payload.durationDays ?? 30;
        if (!tenantId || !plan) {
            throw new common_1.BadRequestException('tenantId y plan son obligatorios');
        }
        if (durationDays < 1) {
            throw new common_1.BadRequestException('durationDays debe ser mayor a 0');
        }
        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant no encontrado');
        }
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
        const subscription = await this.subscriptionRepository.create(tenantId, plan, startDate, endDate);
        await this.enablePlanModules(tenantId, plan);
        return {
            ...subscription,
            event: 'subscription_created',
        };
    }
    async ensureTenantHasActiveSubscription(tenantId) {
        const subscription = await this.subscriptionRepository.findActiveByTenantId(tenantId);
        if (!subscription) {
            throw new common_1.ForbiddenException('Suscripcion inactiva');
        }
        if (new Date(subscription.endDate).getTime() < Date.now()) {
            throw new common_1.ForbiddenException('Suscripcion vencida');
        }
        return subscription;
    }
    async expireOverdueSubscriptions() {
        const expiredTenantIds = await this.subscriptionRepository.expireOverdueSubscriptions(new Date());
        for (const tenantId of expiredTenantIds) {
            await this.tenantRepository.updateStatus(tenantId, 'inactive');
            await this.moduleRepository.disableAllByTenant(tenantId);
        }
        return {
            expiredTenants: expiredTenantIds,
            event: 'subscription_expired',
        };
    }
    async enablePlanModules(tenantId, plan) {
        const normalizedPlan = plan.toLowerCase();
        const modulesByPlan = {
            basic: ['clinical'],
            pro: ['clinical', 'inventory', 'financial'],
            enterprise: ['clinical', 'inventory', 'financial', 'hr', 'erp'],
        };
        const modules = modulesByPlan[normalizedPlan] ?? modulesByPlan.basic;
        for (const moduleName of modules) {
            await this.moduleRepository.upsert(tenantId, moduleName, true);
        }
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [subscription_repository_1.SubscriptionRepository,
        tenant_repository_1.TenantRepository,
        module_repository_1.ModuleRepository])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map