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
exports.TenantRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let TenantRepository = class TenantRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(name) {
        const query = `
      INSERT INTO tenants (name, status, created_at)
      VALUES ($1, 'active', NOW())
      RETURNING id, name, status, created_at, deleted_at
    `;
        const result = await this.databaseService.getPool().query(query, [name]);
        return this.map(result.rows[0]);
    }
    async findById(tenantId) {
        const query = `
      SELECT id, name, status, created_at, deleted_at
      FROM tenants
      WHERE id = $1
      LIMIT 1
    `;
        const result = await this.databaseService
            .getPool()
            .query(query, [tenantId]);
        return result.rows[0] ? this.map(result.rows[0]) : null;
    }
    async updateStatus(tenantId, status) {
        await this.databaseService
            .getPool()
            .query('UPDATE tenants SET status = $2 WHERE id = $1', [tenantId, status]);
    }
    map(row) {
        return {
            id: row.id,
            name: row.name,
            status: row.status,
            createdAt: row.created_at,
            deletedAt: row.deleted_at,
        };
    }
};
exports.TenantRepository = TenantRepository;
exports.TenantRepository = TenantRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], TenantRepository);
//# sourceMappingURL=tenant.repository.js.map