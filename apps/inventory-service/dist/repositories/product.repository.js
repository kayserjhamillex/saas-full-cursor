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
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let ProductRepository = class ProductRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async categoryExists(tenantId, categoryId) {
        const result = await this.databaseService.getPool().query(`
      SELECT id
      FROM categories
      WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
      LIMIT 1
      `, [categoryId, tenantId]);
        return result.rows.length > 0;
    }
    async create(payload) {
        const result = await this.databaseService.getPool().query(`
      INSERT INTO products (tenant_id, category_id, subcategory_id, sku, name, unit, created_at, deleted_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NULL)
      RETURNING id, tenant_id, category_id, subcategory_id, sku, name, unit, created_at, deleted_at
      `, [
            payload.tenantId,
            payload.categoryId,
            payload.subcategoryId ?? null,
            payload.sku,
            payload.name,
            payload.unit,
        ]);
        return this.map(result.rows[0]);
    }
    async findByIdAndTenant(productId, tenantId) {
        const result = await this.databaseService.getPool().query(`
      SELECT id, tenant_id, category_id, subcategory_id, sku, name, unit, created_at, deleted_at
      FROM products
      WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
      LIMIT 1
      `, [productId, tenantId]);
        return result.rows[0] ? this.map(result.rows[0]) : null;
    }
    map(row) {
        return {
            id: row.id,
            tenantId: row.tenant_id,
            categoryId: row.category_id,
            subcategoryId: row.subcategory_id,
            sku: row.sku,
            name: row.name,
            unit: row.unit,
            createdAt: row.created_at,
            deletedAt: row.deleted_at,
        };
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map