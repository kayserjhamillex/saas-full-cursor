import { DatabaseService } from '../services/database.service';
import { PaymentEntity, PaymentStatus } from '../domain/payment.entity';
export declare class PaymentRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(tenantId: string, amount: number, status: PaymentStatus): Promise<PaymentEntity>;
    private map;
}
