/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';

type WarehouseRow = {
  id: string;
  tenant_id: string;
  name: string;
  created_at: Date;
  deleted_at: Date | null;
};

const CREATE_WAREHOUSE_QUERY = `
  INSERT INTO warehouses (tenant_id, name, created_at, deleted_at)
  VALUES ($1, $2, NOW(), NULL)
  RETURNING id, tenant_id, name, created_at, deleted_at
`;

@Injectable()
export class WarehouseRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(tenantId: string, name: string) {
    const result = await this.databaseService
      .getPool()
      .query<WarehouseRow>(CREATE_WAREHOUSE_QUERY, [tenantId, name]);

    return this.mapWarehouse(result.rows[0]);
  }

  private mapWarehouse(row: WarehouseRow) {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      createdAt: row.created_at,
      deletedAt: row.deleted_at,
    };
  }
}
