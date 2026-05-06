import { DatabaseService } from '../services/database.service';
import { TenantEntity, TenantStatus } from '../domain/tenant.entity';
export declare class TenantRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    create(name: string): Promise<TenantEntity>;
    findById(tenantId: string): Promise<TenantEntity | null>;
    updateStatus(tenantId: string, status: TenantStatus): Promise<void>;
    private map;
}
