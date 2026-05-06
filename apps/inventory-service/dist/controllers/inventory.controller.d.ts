import { KardexService } from '../services/kardex.service';
import { MovementService } from '../services/movement.service';
import { StockService } from '../services/stock.service';
export declare class InventoryController {
    private readonly stockService;
    private readonly movementService;
    private readonly kardexService;
    constructor(stockService: StockService, movementService: MovementService, kardexService: KardexService);
    entry(body: {
        tenantId?: string;
        productId?: string;
        warehouseId?: string;
        quantity?: number;
        reference?: string;
        notes?: string;
    }): Promise<{
        stock: import("../domain/stock.entity").StockEntity;
        movement: any;
        kardex: any;
        event: "inventory_entry" | "inventory_exit";
    }>;
    exit(body: {
        tenantId?: string;
        productId?: string;
        warehouseId?: string;
        quantity?: number;
        reference?: string;
        notes?: string;
    }): Promise<{
        stock: import("../domain/stock.entity").StockEntity;
        movement: any;
        kardex: any;
        event: "inventory_entry" | "inventory_exit";
    }>;
    transfer(body: {
        tenantId?: string;
        productId?: string;
        fromWarehouseId?: string;
        toWarehouseId?: string;
        quantity?: number;
        reference?: string;
        notes?: string;
    }): Promise<{
        transfer: any;
        originStock: import("../domain/stock.entity").StockEntity;
        destinationStock: import("../domain/stock.entity").StockEntity;
        movements: any[];
        kardex: any[];
        event: string;
    }>;
    getStock(productId: string, tenantId: string | undefined, warehouseId: string | undefined): Promise<{
        tenantId: string;
        productId: string;
        warehouseId: string;
        quantity: number;
        updatedAt: Date | null;
    }>;
    getKardex(productId: string, tenantId: string | undefined, warehouseId: string | undefined): Promise<any>;
}
