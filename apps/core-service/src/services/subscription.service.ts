import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { ModuleRepository } from '../repositories/module.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly moduleRepository: ModuleRepository,
  ) {}

  async createSubscription(payload: {
    tenantId?: string;
    plan?: string;
    durationDays?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const plan = payload.plan?.trim();
    const durationDays = payload.durationDays ?? 30;

    if (!tenantId || !plan) {
      throw new BadRequestException('tenantId y plan son obligatorios');
    }
    if (durationDays < 1) {
      throw new BadRequestException('durationDays debe ser mayor a 0');
    }

    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const subscription = await this.subscriptionRepository.create(
      tenantId,
      plan,
      startDate,
      endDate,
    );

    await this.enablePlanModules(tenantId, plan);

    return {
      ...subscription,
      event: 'subscription_created',
    };
  }

  async ensureTenantHasActiveSubscription(tenantId: string) {
    const subscription = await this.subscriptionRepository.findActiveByTenantId(tenantId);
    if (!subscription) {
      throw new ForbiddenException('Suscripcion inactiva');
    }
    if (new Date(subscription.endDate).getTime() < Date.now()) {
      throw new ForbiddenException('Suscripcion vencida');
    }
    return subscription;
  }

  async expireOverdueSubscriptions() {
    const expiredTenantIds = await this.subscriptionRepository.expireOverdueSubscriptions(
      new Date(),
    );
    for (const tenantId of expiredTenantIds) {
      await this.tenantRepository.updateStatus(tenantId, 'inactive');
      await this.moduleRepository.disableAllByTenant(tenantId);
    }
    return {
      expiredTenants: expiredTenantIds,
      event: 'subscription_expired',
    };
  }

  private async enablePlanModules(tenantId: string, plan: string) {
    const normalizedPlan = plan.toLowerCase();
    const modulesByPlan: Record<string, string[]> = {
      basic: ['clinical'],
      pro: ['clinical', 'inventory', 'financial'],
      enterprise: ['clinical', 'inventory', 'financial', 'hr', 'erp'],
    };

    const modules = modulesByPlan[normalizedPlan] ?? modulesByPlan.basic;
    for (const moduleName of modules) {
      await this.moduleRepository.upsert(tenantId, moduleName, true);
    }
  }
}
