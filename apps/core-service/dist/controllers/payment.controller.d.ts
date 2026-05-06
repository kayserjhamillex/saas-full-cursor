import { PaymentService } from '../services/payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    registerPayment(body: {
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
