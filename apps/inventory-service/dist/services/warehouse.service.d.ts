import { DatabaseService } from './database.service';
export declare class WarehouseService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    createWarehouse(payload: {
        tenantId?: string;
        name?: string;
    }): Promise<any>;
}
