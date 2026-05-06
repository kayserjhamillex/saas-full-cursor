"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const module_controller_1 = require("./controllers/module.controller");
const payment_controller_1 = require("./controllers/payment.controller");
const subscription_controller_1 = require("./controllers/subscription.controller");
const tenant_controller_1 = require("./controllers/tenant.controller");
const database_service_1 = require("./services/database.service");
const module_service_1 = require("./services/module.service");
const payment_service_1 = require("./services/payment.service");
const saas_validation_service_1 = require("./services/saas-validation.service");
const subscription_service_1 = require("./services/subscription.service");
const tenant_service_1 = require("./services/tenant.service");
const module_repository_1 = require("./repositories/module.repository");
const payment_repository_1 = require("./repositories/payment.repository");
const subscription_repository_1 = require("./repositories/subscription.repository");
const tenant_repository_1 = require("./repositories/tenant.repository");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            tenant_controller_1.TenantController,
            subscription_controller_1.SubscriptionController,
            payment_controller_1.PaymentController,
            module_controller_1.ModuleController,
        ],
        providers: [
            database_service_1.DatabaseService,
            tenant_repository_1.TenantRepository,
            subscription_repository_1.SubscriptionRepository,
            payment_repository_1.PaymentRepository,
            module_repository_1.ModuleRepository,
            tenant_service_1.TenantService,
            subscription_service_1.SubscriptionService,
            payment_service_1.PaymentService,
            module_service_1.ModuleService,
            saas_validation_service_1.SaaSValidationService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map