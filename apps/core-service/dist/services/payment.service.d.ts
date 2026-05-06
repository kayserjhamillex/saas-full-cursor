import { PaymentRepository } from '../repositories/payment.repository';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { ModuleRepository } from '../repositories/module.repository';
export declare class PaymentService {
    private readonly paymentRepository;
    private readonly subscriptionRepository;
    private readonly tenantRepository;
    private readonly moduleRepository;
    constructor(paymentRepository: PaymentRepository, subscriptionRepository: SubscriptionRepository, tenantRepository: TenantRepository, moduleRepository: ModuleRepository);
    registerPayment(payload: {
        tenantId?: string;
        amount?: number;
        status?: 'paid' | 'pending' | 'failed';
        extensionDays?: number;
    }): Promise<{
        event: string;
        id: string;
        tenantId: string;
        amount: number;
        paymentDate: Date;
        status: import("../domain/payment.entity").PaymentStatus;
    }>;
}
