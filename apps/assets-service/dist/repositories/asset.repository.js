"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
const CATEGORY_EXISTS_QUERY = "SELECT 1 AS exists FROM asset_categories WHERE id = $1 AND tenant_id = $2 LIMIT 1";
const EMPLOYEE_EXISTS_QUERY = "SELECT 1 AS exists FROM employees WHERE id = $1 AND tenant_id = $2 LIMIT 1";
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
let AssetRepository = class AssetRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async categoryExists(tenantId, categoryId) {
        const result = await this.databaseService
            .getPool()
            .query(CATEGORY_EXISTS_QUERY, [categoryId, tenantId]);
        return result.rows.length > 0;
    }
    async employeeExists(tenantId, employeeId) {
        const result = await this.databaseService
            .getPool()
            .query(EMPLOYEE_EXISTS_QUERY, [employeeId, tenantId]);
        return result.rows.length > 0;
    }
    async createAsset(payload) {
        const result = await this.databaseService
            .getPool()
            .query(CREATE_ASSET_QUERY, [
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
    async findAssetByIdForUpdate(assetId, tenantId, client) {
        const result = await client.query(SELECT_ASSET_FOR_UPDATE_QUERY, [
            assetId,
            tenantId,
        ]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapAsset(result.rows[0]);
    }
    async findActiveAssignmentByAsset(assetId, tenantId, client) {
        const result = await client.query(SELECT_ACTIVE_ASSIGNMENT_FOR_UPDATE_QUERY, [assetId, tenantId]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapAssignment(result.rows[0]);
    }
    async createAssignment(client, payload) {
        const result = await client.query(CREATE_ASSIGNMENT_QUERY, [
            payload.tenantId,
            payload.assetId,
            payload.employeeId,
            payload.areaName,
            payload.notes,
        ]);
        return this.mapAssignment(result.rows[0]);
    }
    async closeAssignment(assignmentId, notes, client) {
        const result = await client.query(CLOSE_ASSIGNMENT_QUERY, [
            assignmentId,
            notes,
        ]);
        return this.mapAssignment(result.rows[0]);
    }
    async createMovement(client, payload) {
        const result = await client.query(CREATE_MOVEMENT_QUERY, [
            payload.tenantId,
            payload.assetId,
            payload.movementType,
            payload.fromLocation,
            payload.toLocation,
            payload.notes,
        ]);
        return this.mapMovement(result.rows[0]);
    }
    async updateAssetStatus(assetId, status, client) {
        const result = await client.query(UPDATE_ASSET_STATUS_QUERY, [
            assetId,
            status,
        ]);
        return this.mapAsset(result.rows[0]);
    }
    async updateAssetValue(assetId, currentValue, client) {
        const result = await client.query(UPDATE_ASSET_VALUE_QUERY, [
            assetId,
            currentValue,
        ]);
        return this.mapAsset(result.rows[0]);
    }
    async createDepreciation(client, payload) {
        const result = await client.query(CREATE_DEPRECIATION_QUERY, [
            payload.tenantId,
            payload.assetId,
            payload.periodLabel,
            payload.amount,
            payload.previousValue,
            payload.newValue,
            payload.method,
            payload.financialAccountId,
            payload.notes,
        ]);
        return this.mapDepreciation(result.rows[0]);
    }
    mapAsset(row) {
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
    mapAssignment(row) {
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
    mapMovement(row) {
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
    mapDepreciation(row) {
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
};
exports.AssetRepository = AssetRepository;
exports.AssetRepository = AssetRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AssetRepository);
//# sourceMappingURL=asset.repository.js.map