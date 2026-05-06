export type SubscriptionStatus = 'active' | 'inactive' | 'expired';
export type SubscriptionEntity = {
    id: string;
    tenantId: string;
    plan: string;
    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;
};
