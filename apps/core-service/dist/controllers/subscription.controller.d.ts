import { SubscriptionService } from '../services/subscription.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    createSubscription(body: {
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
    expireOverdue(): Promise<{
        expiredTenants: string[];
        event: string;
    }>;
}
