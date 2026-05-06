import { ProductRepository } from '../repositories/product.repository';
import { MovementRepository } from '../repositories/movement.repository';
import { StockRepository } from '../repositories/stock.repository';
export declare class MovementService {
    private readonly productRepository;
    private readonly stockRepository;
    private readonly movementRepository;
    constructor(productRepository: ProductRepository, stockRepository: StockRepository, movementRepository: MovementRepository);
    registerEntry(payload: {
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
    registerExit(payload: {
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
    transfer(payload: {
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
    private validateMovementPayload;
    private ensureProduct;
    private mutateSingleStock;
}
