import { TenantRepository } from '../repositories/tenant.repository';
export declare class TenantService {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
    createTenant(payload: {
        name?: string;
    }): Promise<import("../domain/tenant.entity").TenantEntity>;
    getTenantById(tenantId: string): Promise<import("../domain/tenant.entity").TenantEntity>;
}
