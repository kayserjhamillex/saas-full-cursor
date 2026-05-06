import { Pool, PoolClient } from 'pg';
import { StockEntity } from '../domain/stock.entity';
import { DatabaseService } from '../services/database.service';
type DbClient = Pool | PoolClient;
export declare class StockRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    findStock(tenantId: string, productId: string, warehouseId: string, client?: DbClient): Promise<StockEntity | null>;
    findStockForUpdate(tenantId: string, productId: string, warehouseId: string, client: PoolClient): Promise<StockEntity | null>;
    createStock(tenantId: string, productId: string, warehouseId: string, quantity: number, client: PoolClient): Promise<StockEntity>;
    updateQuantity(stockId: string, quantity: number, client: PoolClient): Promise<StockEntity>;
    private map;
}
export {};
