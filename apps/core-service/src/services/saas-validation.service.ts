import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ModuleService } from './module.service';
import { SubscriptionService } from './subscription.service';
import { TenantService } from './tenant.service';

@Injectable()
export class SaaSValidationService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly subscriptionService: SubscriptionService,
    private readonly moduleService: ModuleService,
  ) {}

  async validateTenantAccess(tenantId: string, moduleName?: string) {
    const sanitizedTenantId = tenantId.trim();
    if (!sanitizedTenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }

    const tenant = await this.tenantService.getTenantById(sanitizedTenantId);
    if (tenant.status !== 'active') {
      throw new ForbiddenException('Tenant inactivo');
    }

    const subscription =
      await this.subscriptionService.ensureTenantHasActiveSubscription(
        sanitizedTenantId,
      );
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
}
