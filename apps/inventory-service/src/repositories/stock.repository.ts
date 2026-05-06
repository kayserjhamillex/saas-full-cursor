/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-redundant-type-constituents -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { StockEntity } from '../domain/stock.entity';
import { DatabaseService } from '../services/database.service';

type DbClient = Pool | PoolClient;

type StockRow = {
  id: string;
  tenant_id: string;
  product_id: string;
  warehouse_id: string;
  quantity: string;
  updated_at: Date;
};

const STOCK_COLUMNS = `
  id, tenant_id, product_id, warehouse_id, quantity, updated_at
`;

const SELECT_STOCK_BY_SCOPE_QUERY = `
  SELECT ${STOCK_COLUMNS}
  FROM stock
  WHERE tenant_id = $1 AND product_id = $2 AND warehouse_id = $3
  LIMIT 1
`;

const SELECT_STOCK_BY_SCOPE_FOR_UPDATE_QUERY = `
  SELECT ${STOCK_COLUMNS}
  FROM stock
  WHERE tenant_id = $1 AND product_id = $2 AND warehouse_id = $3
  FOR UPDATE
`;

const CREATE_STOCK_QUERY = `
  INSERT INTO stock (tenant_id, product_id, warehouse_id, quantity, updated_at)
  VALUES ($1, $2, $3, $4, NOW())
  RETURNING ${STOCK_COLUMNS}
`;

const UPDATE_STOCK_QUANTITY_QUERY = `
  UPDATE stock
  SET quantity = $2, updated_at = NOW()
  WHERE id = $1
  RETURNING ${STOCK_COLUMNS}
`;

@Injectable()
export class StockRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findStock(
    tenantId: string,
    productId: string,
    warehouseId: string,
    client?: DbClient,
  ): Promise<StockEntity | null> {
    const db = client ?? this.databaseService.getPool();
    const result = await db.query<StockRow>(SELECT_STOCK_BY_SCOPE_QUERY, [
      tenantId,
      productId,
      warehouseId,
    ]);
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async findStockForUpdate(
    tenantId: string,
    productId: string,
    warehouseId: string,
    client: PoolClient,
  ): Promise<StockEntity | null> {
    const result = await client.query<StockRow>(
      SELECT_STOCK_BY_SCOPE_FOR_UPDATE_QUERY,
      [tenantId, productId, warehouseId],
    );
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async createStock(
    tenantId: string,
    productId: string,
    warehouseId: string,
    quantity: number,
    client: PoolClient,
  ): Promise<StockEntity> {
    const result = await client.query<StockRow>(CREATE_STOCK_QUERY, [
      tenantId,
      productId,
      warehouseId,
      quantity,
    ]);
    return this.map(result.rows[0]);
  }

  async updateQuantity(
    stockId: string,
    quantity: number,
    client: PoolClient,
  ): Promise<StockEntity> {
    const result = await client.query<StockRow>(UPDATE_STOCK_QUANTITY_QUERY, [
      stockId,
      quantity,
    ]);
    return this.map(result.rows[0]);
  }

  private map(row: StockRow): StockEntity {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      productId: row.product_id,
      warehouseId: row.warehouse_id,
      quantity: Number(row.quantity),
      updatedAt: row.updated_at,
    };
  }
}
