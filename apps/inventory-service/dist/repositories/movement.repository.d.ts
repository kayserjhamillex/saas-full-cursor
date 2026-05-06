import { PoolClient } from 'pg';
import { DatabaseService } from '../services/database.service';
export declare class MovementRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    getPool(): any;
    createMovement(client: PoolClient, payload: {
        tenantId: string;
        productId: string;
        warehouseId: string;
        movementType: 'entry' | 'exit' | 'transfer_out' | 'transfer_in';
        quantity: number;
        reference?: string | null;
        notes?: string | null;
        transferId?: string | null;
    }): Promise<any>;
    createKardexEntry(client: PoolClient, payload: {
        tenantId: string;
        productId: string;
        warehouseId: string;
        movementId: string;
        movementType: string;
        quantityIn: number;
        quantityOut: number;
        balance: number;
    }): Promise<any>;
    createTransfer(client: PoolClient, payload: {
        tenantId: string;
        productId: string;
        fromWarehouseId: string;
        toWarehouseId: string;
        quantity: number;
    }): Promise<any>;
    getKardexByProduct(tenantId: string, productId: string, warehouseId?: string): Promise<any>;
}
