import { ModuleService } from './module.service';
import { SubscriptionService } from './subscription.service';
import { TenantService } from './tenant.service';
export declare class SaaSValidationService {
    private readonly tenantService;
    private readonly subscriptionService;
    private readonly moduleService;
    constructor(tenantService: TenantService, subscriptionService: SubscriptionService, moduleService: ModuleService);
    validateTenantAccess(tenantId: string, moduleName?: string): Promise<{
        tenantId: string;
        tenantStatus: "active";
        subscriptionId: string;
        subscriptionActive: boolean;
        module: {
            moduleName: string;
            isActive: boolean;
        } | null;
        valid: boolean;
    }>;
}
