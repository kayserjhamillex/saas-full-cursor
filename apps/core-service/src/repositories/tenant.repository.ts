/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { TenantEntity, TenantStatus } from '../domain/tenant.entity';

type TenantRow = {
  id: string;
  name: string;
  status: TenantStatus;
  created_at: Date;
  deleted_at: Date | null;
};

const TENANT_COLUMNS = `
  id, name, status, created_at, deleted_at
`;

const CREATE_TENANT_QUERY = `
  INSERT INTO tenants (name, status, created_at)
  VALUES ($1, 'active', NOW())
  RETURNING ${TENANT_COLUMNS}
`;

const SELECT_TENANT_BY_ID_QUERY = `
  SELECT ${TENANT_COLUMNS}
  FROM tenants
  WHERE id = $1
  LIMIT 1
`;

const UPDATE_TENANT_STATUS_QUERY = `
  UPDATE tenants
  SET status = $2
  WHERE id = $1
`;

@Injectable()
export class TenantRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(name: string): Promise<TenantEntity> {
    const result = await this.databaseService
      .getPool()
      .query<TenantRow>(CREATE_TENANT_QUERY, [name]);
    return this.map(result.rows[0]);
  }

  async findById(tenantId: string): Promise<TenantEntity | null> {
    const result = await this.databaseService
      .getPool()
      .query<TenantRow>(SELECT_TENANT_BY_ID_QUERY, [tenantId]);
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async updateStatus(tenantId: string, status: TenantStatus): Promise<void> {
    await this.databaseService
      .getPool()
      .query(UPDATE_TENANT_STATUS_QUERY, [tenantId, status]);
  }

  private map(row: TenantRow): TenantEntity {
    return {
      id: row.id,
      name: row.name,
      status: row.status,
      createdAt: row.created_at,
      deletedAt: row.deleted_at,
    };
  }
}
