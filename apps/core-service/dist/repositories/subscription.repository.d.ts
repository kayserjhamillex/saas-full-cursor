import { DatabaseService } from '../services/database.service';
import { SubscriptionEntity } from '../domain/subscription.entity';
export declare class SubscriptionRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(tenantId: string, plan: string, startDate: Date, endDate: Date): Promise<SubscriptionEntity>;
    findActiveByTenantId(tenantId: string): Promise<SubscriptionEntity | null>;
    expireOverdueSubscriptions(currentDate: Date): Promise<string[]>;
    reactivateLatest(tenantId: string, extensionDate: Date): Promise<void>;
    private map;
}
