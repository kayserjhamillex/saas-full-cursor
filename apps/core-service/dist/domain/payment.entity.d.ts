export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type PaymentEntity = {
    id: string;
    tenantId: string;
    amount: number;
    paymentDate: Date;
    status: PaymentStatus;
};
