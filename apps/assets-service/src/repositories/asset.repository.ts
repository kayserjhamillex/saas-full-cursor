/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Infraestructura SQL con driver pg */
import { Injectable } from "@nestjs/common";
import { PoolClient } from "pg";
import { DatabaseService } from "../services/database.service";

type AssetRow = {
  id: string;
  tenant_id: string;
  category_id: string;
  code: string;
  name: string;
  description: string | null;
  acquisition_date: Date | null;
  acquisition_cost: string;
  useful_life_months: string;
  current_value: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

type AssignmentRow = {
  id: string;
  tenant_id: string;
  asset_id: string;
  employee_id: string;
  area_name: string | null;
  assigned_at: Date;
  returned_at: Date | null;
  notes: string | null;
};

type MovementRow = {
  id: string;
  tenant_id: string;
  asset_id: string;
  movement_type: string;
  from_location: string | null;
  to_location: string | null;
  movement_date: Date;
  notes: string | null;
};

type DepreciationRow = {
  id: string;
  tenant_id: string;
  asset_id: string;
  period_label: string;
  amount: string;
  previous_value: string;
  new_value: string;
  method: string;
  financial_account_id: string | null;
  depreciation_date: Date;
  notes: string | null;
};

type ExistsRow = { exists: number };

const CATEGORY_EXISTS_QUERY =
  "SELECT 1 AS exists FROM asset_categories WHERE id = $1 AND tenant_id = $2 LIMIT 1";
const EMPLOYEE_EXISTS_QUERY =
  "SELECT 1 AS exists FROM employees WHERE id = $1 AND tenant_id = $2 LIMIT 1";

const ASSET_COLUMNS = `
  id, tenant_id, category_id, code, name, description, acquisition_date,
  acquisition_cost, useful_life_months, current_value, status, created_at, updated_at
`;

const ASSIGNMENT_COLUMNS = `
  id, tenant_id, asset_id, employee_id, area_name, assigned_at, returned_at, notes
`;

const MOVEMENT_COLUMNS = `
  id, tenant_id, asset_id, movement_type, from_location, to_location, movement_date, notes
`;

const DEPRECIATION_COLUMNS = `
  id, tenant_id, asset_id, period_label, amount, previous_value, new_value, method,
  financial_account_id, depreciation_date, notes
`;

const CREATE_ASSET_QUERY = `
  INSERT INTO assets (
    tenant_id, category_id, code, name, description, acquisition_date,
    acquisition_cost, useful_life_months, current_value, status, created_at, updated_at
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
  RETURNING ${ASSET_COLUMNS}
`;

const SELECT_ASSET_FOR_UPDATE_QUERY = `
  SELECT ${ASSET_COLUMNS}
  FROM assets
  WHERE id = $1 AND tenant_id = $2
  FOR UPDATE
`;

const SELECT_ACTIVE_ASSIGNMENT_FOR_UPDATE_QUERY = `
  SELECT ${ASSIGNMENT_COLUMNS}
  FROM asset_assignments
  WHERE asset_id = $1 AND tenant_id = $2 AND returned_at IS NULL
  ORDER BY assigned_at DESC
  LIMIT 1
  FOR UPDATE
`;

const CREATE_ASSIGNMENT_QUERY = `
  INSERT INTO asset_assignments (tenant_id, asset_id, employee_id, area_name, assigned_at, notes)
  VALUES ($1, $2, $3, $4, NOW(), $5)
  RETURNING ${ASSIGNMENT_COLUMNS}
`;

const CLOSE_ASSIGNMENT_QUERY = `
  UPDATE asset_assignments
  SET returned_at = NOW(),
      notes = COALESCE($2, notes)
  WHERE id = $1
  RETURNING ${ASSIGNMENT_COLUMNS}
`;

const CREATE_MOVEMENT_QUERY = `
  INSERT INTO asset_movements (tenant_id, asset_id, movement_type, from_location, to_location, movement_date, notes)
  VALUES ($1, $2, $3, $4, $5, NOW(), $6)
  RETURNING ${MOVEMENT_COLUMNS}
`;

const UPDATE_ASSET_STATUS_QUERY = `
  UPDATE assets
  SET status = $2,
      updated_at = NOW()
  WHERE id = $1
  RETURNING ${ASSET_COLUMNS}
`;

const UPDATE_ASSET_VALUE_QUERY = `
  UPDATE assets
  SET current_value = $2,
      updated_at = NOW()
  WHERE id = $1
  RETURNING ${ASSET_COLUMNS}
`;

const CREATE_DEPRECIATION_QUERY = `
  INSERT INTO depreciation (
    tenant_id, asset_id, period_label, amount, previous_value, new_value, method,
    financial_account_id, depreciation_date, notes
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9)
  RETURNING ${DEPRECIATION_COLUMNS}
`;

@Injectable()
export class AssetRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async categoryExists(tenantId: string, categoryId: string) {
    const result = await this.databaseService
      .getPool()
      .query<ExistsRow>(CATEGORY_EXISTS_QUERY, [categoryId, tenantId]);
    return result.rows.length > 0;
  }

  async employeeExists(tenantId: string, employeeId: string) {
    const result = await this.databaseService
      .getPool()
      .query<ExistsRow>(EMPLOYEE_EXISTS_QUERY, [employeeId, tenantId]);
    return result.rows.length > 0;
  }

  async createAsset(payload: {
    tenantId: string;
    categoryId: string;
    code: string;
    name: string;
    description: string | null;
    acquisitionDate: string | null;
    acquisitionCost: number;
    usefulLifeMonths: number;
    currentValue: number;
    status: string;
  }) {
    const result = await this.databaseService
      .getPool()
      .query<AssetRow>(CREATE_ASSET_QUERY, [
        payload.tenantId,
        payload.categoryId,
        payload.code,
        payload.name,
        payload.description,
        payload.acquisitionDate,
        payload.acquisitionCost,
        payload.usefulLifeMonths,
        payload.currentValue,
        payload.status,
      ]);
    return this.mapAsset(result.rows[0]);
  }

  async findAssetByIdForUpdate(
    assetId: string,
    tenantId: string,
    client: PoolClient,
  ) {
    const result = await client.query<AssetRow>(SELECT_ASSET_FOR_UPDATE_QUERY, [
      assetId,
      tenantId,
    ]);
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapAsset(result.rows[0]);
  }

  async findActiveAssignmentByAsset(
    assetId: string,
    tenantId: string,
    client: PoolClient,
  ) {
    const result = await client.query<AssignmentRow>(
      SELECT_ACTIVE_ASSIGNMENT_FOR_UPDATE_QUERY,
      [assetId, tenantId],
    );
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapAssignment(result.rows[0]);
  }

  async createAssignment(
    client: PoolClient,
    payload: {
      tenantId: string;
      assetId: string;
      employeeId: string;
      areaName: string | null;
      notes: string | null;
    },
  ) {
    const result = await client.query<AssignmentRow>(CREATE_ASSIGNMENT_QUERY, [
      payload.tenantId,
      payload.assetId,
      payload.employeeId,
      payload.areaName,
      payload.notes,
    ]);
    return this.mapAssignment(result.rows[0]);
  }

  async closeAssignment(
    assignmentId: string,
    notes: string | null,
    client: PoolClient,
  ) {
    const result = await client.query<AssignmentRow>(CLOSE_ASSIGNMENT_QUERY, [
      assignmentId,
      notes,
    ]);
    return this.mapAssignment(result.rows[0]);
  }

  async createMovement(
    client: PoolClient,
    payload: {
      tenantId: string;
      assetId: string;
      movementType: string;
      fromLocation: string | null;
      toLocation: string | null;
      notes: string | null;
    },
  ) {
    const result = await client.query<MovementRow>(CREATE_MOVEMENT_QUERY, [
      payload.tenantId,
      payload.assetId,
      payload.movementType,
      payload.fromLocation,
      payload.toLocation,
      payload.notes,
    ]);
    return this.mapMovement(result.rows[0]);
  }

  async updateAssetStatus(assetId: string, status: string, client: PoolClient) {
    const result = await client.query<AssetRow>(UPDATE_ASSET_STATUS_QUERY, [
      assetId,
      status,
    ]);
    return this.mapAsset(result.rows[0]);
  }

  async updateAssetValue(
    assetId: string,
    currentValue: number,
    client: PoolClient,
  ) {
    const result = await client.query<AssetRow>(UPDATE_ASSET_VALUE_QUERY, [
      assetId,
      currentValue,
    ]);
    return this.mapAsset(result.rows[0]);
  }

  async createDepreciation(
    client: PoolClient,
    payload: {
      tenantId: string;
      assetId: string;
      periodLabel: string;
      amount: number;
      previousValue: number;
      newValue: number;
      method: string;
      financialAccountId: string | null;
      notes: string | null;
    },
  ) {
    const result = await client.query<DepreciationRow>(
      CREATE_DEPRECIATION_QUERY,
      [
        payload.tenantId,
        payload.assetId,
        payload.periodLabel,
        payload.amount,
        payload.previousValue,
        payload.newValue,
        payload.method,
        payload.financialAccountId,
        payload.notes,
      ],
    );
    return this.mapDepreciation(result.rows[0]);
  }

  private mapAsset(row: AssetRow) {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      categoryId: String(row.category_id),
      code: String(row.code),
      name: String(row.name),
      description: row.description ?? null,
      acquisitionDate: row.acquisition_date ?? null,
      acquisitionCost: Number(row.acquisition_cost),
      usefulLifeMonths: Number(row.useful_life_months),
      currentValue: Number(row.current_value),
      status: String(row.status),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapAssignment(row: AssignmentRow) {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      assetId: String(row.asset_id),
      employeeId: String(row.employee_id),
      areaName: row.area_name ?? null,
      assignedAt: row.assigned_at,
      returnedAt: row.returned_at ?? null,
      notes: row.notes ?? null,
    };
  }

  private mapMovement(row: MovementRow) {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      assetId: String(row.asset_id),
      movementType: String(row.movement_type),
      fromLocation: row.from_location ?? null,
      toLocation: row.to_location ?? null,
      movementDate: row.movement_date,
      notes: row.notes ?? null,
    };
  }

  private mapDepreciation(row: DepreciationRow) {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      assetId: String(row.asset_id),
      periodLabel: String(row.period_label),
      amount: Number(row.amount),
      previousValue: Number(row.previous_value),
      newValue: Number(row.new_value),
      method: String(row.method),
      financialAccountId: row.financial_account_id ?? null,
      depreciationDate: row.depreciation_date,
      notes: row.notes ?? null,
    };
  }
}
