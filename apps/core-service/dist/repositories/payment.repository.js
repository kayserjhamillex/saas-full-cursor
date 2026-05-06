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
exports.PaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let PaymentRepository = class PaymentRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(tenantId, amount, status) {
        const query = `
      INSERT INTO payments (tenant_id, amount, payment_date, status)
      VALUES ($1, $2, NOW(), $3)
      RETURNING id, tenant_id, amount, payment_date, status
    `;
        const result = await this.databaseService
            .getPool()
            .query(query, [tenantId, amount, status]);
        return this.map(result.rows[0]);
    }
    map(row) {
        return {
            id: row.id,
            tenantId: row.tenant_id,
            amount: Number(row.amount),
            paymentDate: row.payment_date,
            status: row.status,
        };
    }
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], PaymentRepository);
//# sourceMappingURL=payment.repository.js.map