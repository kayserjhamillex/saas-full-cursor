import { SubscriptionRepository } from '../repositories/subscription.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { ModuleRepository } from '../repositories/module.repository';
export declare class SubscriptionService {
    private readonly subscriptionRepository;
    private readonly tenantRepository;
    private readonly moduleRepository;
    constructor(subscriptionRepository: SubscriptionRepository, tenantRepository: TenantRepository, moduleRepository: ModuleRepository);
    createSubscription(payload: {
        tenantId?: string;
        plan?: string;
        durationDays?: number;
    }): Promise<{
        event: string;
        id: string;
        tenantId: string;
        plan: string;
        startDate: Date;
        endDate: Date;
        status: import("../domain/subscription.entity").SubscriptionStatus;
    }>;
    ensureTenantHasActiveSubscription(tenantId: string): Promise<import("../domain/subscription.entity").SubscriptionEntity>;
    expireOverdueSubscriptions(): Promise<{
        expiredTenants: string[];
        event: string;
    }>;
    private enablePlanModules;
}
