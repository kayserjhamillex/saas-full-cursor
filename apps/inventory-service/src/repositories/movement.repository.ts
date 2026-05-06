/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../services/database.service';

type MovementRow = {
  id: string;
  tenant_id: string;
  product_id: string;
  warehouse_id: string;
  movement_type: 'entry' | 'exit' | 'transfer_out' | 'transfer_in';
  quantity: string;
  reference: string | null;
  notes: string | null;
  transfer_id: string | null;
  created_at: Date;
};

type KardexRow = {
  id: string;
  tenant_id: string;
  product_id: string;
  warehouse_id: string;
  movement_id: string;
  movement_type: string;
  quantity_in: string;
  quantity_out: string;
  balance: string;
  created_at: Date;
};

type TransferRow = {
  id: string;
  tenant_id: string;
  product_id: string;
  from_warehouse_id: string;
  to_warehouse_id: string;
  quantity: string;
  status: string;
  created_at: Date;
  completed_at: Date | null;
};

const CREATE_MOVEMENT_QUERY = `
  INSERT INTO inventory_movements
  (tenant_id, product_id, warehouse_id, movement_type, quantity, reference, notes, transfer_id, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
  RETURNING id, tenant_id, product_id, warehouse_id, movement_type, quantity, reference, notes, transfer_id, created_at
`;

const CREATE_KARDEX_ENTRY_QUERY = `
  INSERT INTO kardex_entries
  (tenant_id, product_id, warehouse_id, movement_id, movement_type, quantity_in, quantity_out, balance, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
  RETURNING id, tenant_id, product_id, warehouse_id, movement_id, movement_type, quantity_in, quantity_out, balance, created_at
`;

const CREATE_TRANSFER_QUERY = `
  INSERT INTO transfers
  (tenant_id, product_id, from_warehouse_id, to_warehouse_id, quantity, status, created_at, completed_at)
  VALUES ($1, $2, $3, $4, $5, 'completed', NOW(), NOW())
  RETURNING id, tenant_id, product_id, from_warehouse_id, to_warehouse_id, quantity, status, created_at, completed_at
`;

const SELECT_KARDEX_BY_PRODUCT_BASE_QUERY = `
  SELECT id, tenant_id, product_id, warehouse_id, movement_id, movement_type, quantity_in, quantity_out, balance, created_at
  FROM kardex_entries
  WHERE tenant_id = $1 AND product_id = $2
`;

@Injectable()
export class MovementRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createMovement(
    client: PoolClient,
    payload: {
      tenantId: string;
      productId: string;
      warehouseId: string;
      movementType: 'entry' | 'exit' | 'transfer_out' | 'transfer_in';
      quantity: number;
      reference?: string | null;
      notes?: string | null;
      transferId?: string | null;
    },
  ) {
    const result = await client.query<MovementRow>(CREATE_MOVEMENT_QUERY, [
      payload.tenantId,
      payload.productId,
      payload.warehouseId,
      payload.movementType,
      payload.quantity,
      payload.reference ?? null,
      payload.notes ?? null,
      payload.transferId ?? null,
    ]);
    return result.rows[0];
  }

  async createKardexEntry(
    client: PoolClient,
    payload: {
      tenantId: string;
      productId: string;
      warehouseId: string;
      movementId: string;
      movementType: string;
      quantityIn: number;
      quantityOut: number;
      balance: number;
    },
  ) {
    const result = await client.query<KardexRow>(CREATE_KARDEX_ENTRY_QUERY, [
      payload.tenantId,
      payload.productId,
      payload.warehouseId,
      payload.movementId,
      payload.movementType,
      payload.quantityIn,
      payload.quantityOut,
      payload.balance,
    ]);
    return result.rows[0];
  }

  async createTransfer(
    client: PoolClient,
    payload: {
      tenantId: string;
      productId: string;
      fromWarehouseId: string;
      toWarehouseId: string;
      quantity: number;
    },
  ) {
    const result = await client.query<TransferRow>(CREATE_TRANSFER_QUERY, [
      payload.tenantId,
      payload.productId,
      payload.fromWarehouseId,
      payload.toWarehouseId,
      payload.quantity,
    ]);
    return result.rows[0];
  }

  async getKardexByProduct(
    tenantId: string,
    productId: string,
    warehouseId?: string,
  ) {
    const params: string[] = [tenantId, productId];
    const warehouseFilter = warehouseId ? ' AND warehouse_id = $3' : '';
    if (warehouseId) {
      params.push(warehouseId);
    }
    const query = `${SELECT_KARDEX_BY_PRODUCT_BASE_QUERY}${warehouseFilter} ORDER BY created_at DESC`;

    const result = await this.databaseService
      .getPool()
      .query<KardexRow>(query, params);
    return result.rows.map((row) => ({
      id: row.id,
      tenantId: row.tenant_id,
      productId: row.product_id,
      warehouseId: row.warehouse_id,
      movementId: row.movement_id,
      movementType: row.movement_type,
      quantityIn: Number(row.quantity_in),
      quantityOut: Number(row.quantity_out),
      balance: Number(row.balance),
      createdAt: row.created_at,
    }));
  }
}
