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
exports.SubscriptionRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let SubscriptionRepository = class SubscriptionRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(tenantId, plan, startDate, endDate) {
        const query = `
      INSERT INTO subscriptions (tenant_id, plan, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, 'active')
      RETURNING id, tenant_id, plan, start_date, end_date, status
    `;
        const result = await this.databaseService
            .getPool()
            .query(query, [tenantId, plan, startDate, endDate]);
        return this.map(result.rows[0]);
    }
    async findActiveByTenantId(tenantId) {
        const query = `
      SELECT id, tenant_id, plan, start_date, end_date, status
      FROM subscriptions
      WHERE tenant_id = $1 AND status = 'active'
      ORDER BY end_date DESC
      LIMIT 1
    `;
        const result = await this.databaseService
            .getPool()
            .query(query, [tenantId]);
        return result.rows[0] ? this.map(result.rows[0]) : null;
    }
    async expireOverdueSubscriptions(currentDate) {
        const query = `
      UPDATE subscriptions
      SET status = 'expired'
      WHERE status = 'active' AND end_date < $1
      RETURNING tenant_id
    `;
        const result = await this.databaseService
            .getPool()
            .query(query, [currentDate]);
        return result.rows.map((row) => row.tenant_id);
    }
    async reactivateLatest(tenantId, extensionDate) {
        const query = `
      UPDATE subscriptions
      SET status = 'active', end_date = $2
      WHERE id = (
        SELECT id
        FROM subscriptions
        WHERE tenant_id = $1
        ORDER BY end_date DESC
        LIMIT 1
      )
    `;
        await this.databaseService.getPool().query(query, [tenantId, extensionDate]);
    }
    map(row) {
        return {
            id: row.id,
            tenantId: row.tenant_id,
            plan: row.plan,
            startDate: row.start_date,
            endDate: row.end_date,
            status: row.status,
        };
    }
};
exports.SubscriptionRepository = SubscriptionRepository;
exports.SubscriptionRepository = SubscriptionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], SubscriptionRepository);
//# sourceMappingURL=subscription.repository.js.map