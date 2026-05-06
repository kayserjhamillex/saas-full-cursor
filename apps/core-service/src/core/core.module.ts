import { Module } from '@nestjs/common';
import { ModuleController } from '../controllers/module.controller';
import { PaymentController } from '../controllers/payment.controller';
import { SubscriptionController } from '../controllers/subscription.controller';
import { TenantController } from '../controllers/tenant.controller';
import { InternalServiceTokenGuard } from '../guards/internal-service-token.guard';
import { ModuleRepository } from '../repositories/module.repository';
import { PaymentRepository } from '../repositories/payment.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { DatabaseService } from '../services/database.service';
import { ModuleService } from '../services/module.service';
import { PaymentService } from '../services/payment.service';
import { SaaSValidationService } from '../services/saas-validation.service';
import { SubscriptionService } from '../services/subscription.service';
import { TenantService } from '../services/tenant.service';

@Module({
  controllers: [
    TenantController,
    SubscriptionController,
    PaymentController,
    ModuleController,
  ],
  providers: [
    DatabaseService,
    TenantRepository,
    SubscriptionRepository,
    PaymentRepository,
    ModuleRepository,
    TenantService,
    SubscriptionService,
    PaymentService,
    ModuleService,
    SaaSValidationService,
    InternalServiceTokenGuard,
  ],
})
export class CoreModule {}
