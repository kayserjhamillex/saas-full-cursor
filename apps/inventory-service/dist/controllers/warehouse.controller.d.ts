import { WarehouseService } from '../services/warehouse.service';
export declare class WarehouseController {
    private readonly warehouseService;
    constructor(warehouseService: WarehouseService);
    createWarehouse(body: {
        tenantId?: string;
        name?: string;
    }): Promise<any>;
}
