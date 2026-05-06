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
exports.MovementRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let MovementRepository = class MovementRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    getPool() {
        return this.databaseService.getPool();
    }
    async createMovement(client, payload) {
        const result = await client.query(`
      INSERT INTO inventory_movements
      (tenant_id, product_id, warehouse_id, movement_type, quantity, reference, notes, transfer_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id, tenant_id, product_id, warehouse_id, movement_type, quantity, reference, notes, transfer_id, created_at
      `, [
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
    async createKardexEntry(client, payload) {
        const result = await client.query(`
      INSERT INTO kardex_entries
      (tenant_id, product_id, warehouse_id, movement_id, movement_type, quantity_in, quantity_out, balance, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id, tenant_id, product_id, warehouse_id, movement_id, movement_type, quantity_in, quantity_out, balance, created_at
      `, [
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
    async createTransfer(client, payload) {
        const result = await client.query(`
      INSERT INTO transfers
      (tenant_id, product_id, from_warehouse_id, to_warehouse_id, quantity, status, created_at, completed_at)
      VALUES ($1, $2, $3, $4, $5, 'completed', NOW(), NOW())
      RETURNING id, tenant_id, product_id, from_warehouse_id, to_warehouse_id, quantity, status, created_at, completed_at
      `, [payload.tenantId, payload.productId, payload.fromWarehouseId, payload.toWarehouseId, payload.quantity]);
        return result.rows[0];
    }
    async getKardexByProduct(tenantId, productId, warehouseId) {
        const params = [tenantId, productId];
        const warehouseFilter = warehouseId ? 'AND warehouse_id = $3' : '';
        if (warehouseId) {
            params.push(warehouseId);
        }
        const result = await this.databaseService.getPool().query(`
      SELECT id, tenant_id, product_id, warehouse_id, movement_id, movement_type, quantity_in, quantity_out, balance, created_at
      FROM kardex_entries
      WHERE tenant_id = $1 AND product_id = $2 ${warehouseFilter}
      ORDER BY created_at DESC
      `, params);
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
};
exports.MovementRepository = MovementRepository;
exports.MovementRepository = MovementRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], MovementRepository);
//# sourceMappingURL=movement.repository.js.map