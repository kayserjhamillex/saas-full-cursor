/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';

type TenantModuleRow = {
  module_name: string;
  is_active: boolean;
};

const UPSERT_TENANT_MODULE_QUERY = `
  INSERT INTO tenant_modules (tenant_id, module_name, is_active)
  VALUES ($1, $2, $3)
  ON CONFLICT (tenant_id, module_name)
  DO UPDATE SET is_active = EXCLUDED.is_active
`;

const SELECT_TENANT_MODULES_QUERY = `
  SELECT module_name, is_active
  FROM tenant_modules
  WHERE tenant_id = $1
`;

const DISABLE_ALL_TENANT_MODULES_QUERY = `
  UPDATE tenant_modules
  SET is_active = false
  WHERE tenant_id = $1
`;

@Injectable()
export class ModuleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async upsert(
    tenantId: string,
    moduleName: string,
    isActive: boolean,
  ): Promise<void> {
    await this.databaseService
      .getPool()
      .query(UPSERT_TENANT_MODULE_QUERY, [tenantId, moduleName, isActive]);
  }

  async listByTenant(tenantId: string): Promise<TenantModuleRow[]> {
    const result = await this.databaseService
      .getPool()
      .query<TenantModuleRow>(SELECT_TENANT_MODULES_QUERY, [tenantId]);
    return result.rows;
  }

  async disableAllByTenant(tenantId: string): Promise<void> {
    await this.databaseService
      .getPool()
      .query(DISABLE_ALL_TENANT_MODULES_QUERY, [tenantId]);
  }
}
