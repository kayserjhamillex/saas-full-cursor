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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const payment_repository_1 = require("../repositories/payment.repository");
const subscription_repository_1 = require("../repositories/subscription.repository");
const tenant_repository_1 = require("../repositories/tenant.repository");
const module_repository_1 = require("../repositories/module.repository");
let PaymentService = class PaymentService {
    paymentRepository;
    subscriptionRepository;
    tenantRepository;
    moduleRepository;
    constructor(paymentRepository, subscriptionRepository, tenantRepository, moduleRepository) {
        this.paymentRepository = paymentRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.tenantRepository = tenantRepository;
        this.moduleRepository = moduleRepository;
    }
    async registerPayment(payload) {
        const tenantId = payload.tenantId?.trim();
        const amount = payload.amount ?? 0;
        const status = payload.status ?? 'paid';
        const extensionDays = payload.extensionDays ?? 30;
        if (!tenantId || amount <= 0) {
            throw new common_1.BadRequestException('tenantId y amount valido son obligatorios');
        }
        const tenant = await this.tenantRepository.findById(tenantId);
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant no encontrado');
        }
        const payment = await this.paymentRepository.create(tenantId, amount, status);
        if (status === 'paid') {
            const extensionDate = new Date(Date.now() + extensionDays * 24 * 60 * 60 * 1000);
            await this.subscriptionRepository.reactivateLatest(tenantId, extensionDate);
            await this.tenantRepository.updateStatus(tenantId, 'active');
            const modules = await this.moduleRepository.listByTenant(tenantId);
            for (const module of modules) {
                await this.moduleRepository.upsert(tenantId, module.module_name, true);
            }
        }
        return {
            ...payment,
            event: 'payment_received',
        };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_repository_1.PaymentRepository,
        subscription_repository_1.SubscriptionRepository,
        tenant_repository_1.TenantRepository,
        module_repository_1.ModuleRepository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map