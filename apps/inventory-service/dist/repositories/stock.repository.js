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
exports.StockRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let StockRepository = class StockRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async findStock(tenantId, productId, warehouseId, client) {
        const db = client ?? this.databaseService.getPool();
        const result = await db.query(`
      SELECT id, tenant_id, product_id, warehouse_id, quantity, updated_at
      FROM stock
      WHERE tenant_id = $1 AND product_id = $2 AND warehouse_id = $3
      LIMIT 1
      `, [tenantId, productId, warehouseId]);
        return result.rows[0] ? this.map(result.rows[0]) : null;
    }
    async findStockForUpdate(tenantId, productId, warehouseId, client) {
        const result = await client.query(`
      SELECT id, tenant_id, product_id, warehouse_id, quantity, updated_at
      FROM stock
      WHERE tenant_id = $1 AND product_id = $2 AND warehouse_id = $3
      FOR UPDATE
      `, [tenantId, productId, warehouseId]);
        return result.rows[0] ? this.map(result.rows[0]) : null;
    }
    async createStock(tenantId, productId, warehouseId, quantity, client) {
        const result = await client.query(`
      INSERT INTO stock (tenant_id, product_id, warehouse_id, quantity, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, tenant_id, product_id, warehouse_id, quantity, updated_at
      `, [tenantId, productId, warehouseId, quantity]);
        return this.map(result.rows[0]);
    }
    async updateQuantity(stockId, quantity, client) {
        const result = await client.query(`
      UPDATE stock
      SET quantity = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, tenant_id, product_id, warehouse_id, quantity, updated_at
      `, [stockId, quantity]);
        return this.map(result.rows[0]);
    }
    map(row) {
        return {
            id: row.id,
            tenantId: row.tenant_id,
            productId: row.product_id,
            warehouseId: row.warehouse_id,
            quantity: Number(row.quantity),
            updatedAt: row.updated_at,
        };
    }
};
exports.StockRepository = StockRepository;
exports.StockRepository = StockRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], StockRepository);
//# sourceMappingURL=stock.repository.js.map