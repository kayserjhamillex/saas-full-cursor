import { SaaSValidationService } from '../services/saas-validation.service';
import { TenantService } from '../services/tenant.service';
export declare class TenantController {
    private readonly tenantService;
    private readonly saasValidationService;
    constructor(tenantService: TenantService, saasValidationService: SaaSValidationService);
    createTenant(body: {
        name?: string;
    }): Promise<import("../domain/tenant.entity").TenantEntity>;
    getTenant(tenantId: string): Promise<import("../domain/tenant.entity").TenantEntity>;
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
