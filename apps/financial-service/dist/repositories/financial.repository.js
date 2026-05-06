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
exports.FinancialRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let FinancialRepository = class FinancialRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    getPool() {
        return this.databaseService.getPool();
    }
    async createAccount(payload) {
        const result = await this.databaseService.getPool().query(`INSERT INTO financial_accounts (tenant_id, name, account_type, currency, current_balance, is_active, created_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW())
       RETURNING id, tenant_id, name, account_type, currency, current_balance, is_active, created_at`, [payload.tenantId, payload.name, payload.accountType, payload.currency, payload.initialBalance]);
        return this.mapAccount(result.rows[0]);
    }
    async getAccountsByTenant(tenantId) {
        const result = await this.databaseService.getPool().query(`SELECT id, tenant_id, name, account_type, currency, current_balance, is_active, created_at
       FROM financial_accounts
       WHERE tenant_id = $1
       ORDER BY created_at DESC`, [tenantId]);
        return result.rows.map((row) => this.mapAccount(row));
    }
    async findAccountByIdForUpdate(accountId, tenantId, client) {
        const result = await client.query(`SELECT id, tenant_id, name, account_type, currency, current_balance, is_active, created_at
       FROM financial_accounts
       WHERE id = $1 AND tenant_id = $2
       FOR UPDATE`, [accountId, tenantId]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapAccount(result.rows[0]);
    }
    async updateAccountBalance(accountId, nextBalance, client) {
        const result = await client.query(`UPDATE financial_accounts
       SET current_balance = $2
       WHERE id = $1
       RETURNING id, tenant_id, name, account_type, currency, current_balance, is_active, created_at`, [accountId, nextBalance]);
        return this.mapAccount(result.rows[0]);
    }
    async createTransaction(client, payload) {
        const result = await client.query(`INSERT INTO transactions (tenant_id, account_id, transaction_type, amount, source_module, reference, notes, transaction_date, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING id, tenant_id, account_id, transaction_type, amount, source_module, reference, notes, transaction_date, created_at`, [
            payload.tenantId,
            payload.accountId,
            payload.transactionType,
            payload.amount,
            payload.sourceModule,
            payload.reference,
            payload.notes,
        ]);
        return this.mapTransaction(result.rows[0]);
    }
    async createTransactionDetail(client, payload) {
        const result = await client.query(`INSERT INTO transaction_details (transaction_id, account_id, entry_type, amount, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, transaction_id, account_id, entry_type, amount, description`, [
            payload.transactionId,
            payload.accountId,
            payload.entryType,
            payload.amount,
            payload.description,
        ]);
        return result.rows[0];
    }
    async getTransactionsByTenant(tenantId, accountId, transactionType) {
        const params = [tenantId];
        const filters = ['tenant_id = $1'];
        if (accountId) {
            params.push(accountId);
            filters.push(`account_id = $${params.length}`);
        }
        if (transactionType) {
            params.push(transactionType);
            filters.push(`transaction_type = $${params.length}`);
        }
        const result = await this.databaseService.getPool().query(`SELECT id, tenant_id, account_id, transaction_type, amount, source_module, reference, notes, transaction_date, created_at
       FROM transactions
       WHERE ${filters.join(' AND ')}
       ORDER BY transaction_date DESC, created_at DESC`, params);
        return result.rows.map((row) => this.mapTransaction(row));
    }
    mapAccount(row) {
        return {
            id: String(row.id),
            tenantId: String(row.tenant_id),
            name: String(row.name),
            accountType: String(row.account_type),
            currency: String(row.currency),
            currentBalance: Number(row.current_balance),
            isActive: Boolean(row.is_active),
            createdAt: row.created_at,
        };
    }
    mapTransaction(row) {
        return {
            id: String(row.id),
            tenantId: String(row.tenant_id),
            accountId: String(row.account_id),
            transactionType: String(row.transaction_type),
            amount: Number(row.amount),
            sourceModule: String(row.source_module),
            reference: row.reference ?? null,
            notes: row.notes ?? null,
            transactionDate: row.transaction_date,
            createdAt: row.created_at,
        };
    }
};
exports.FinancialRepository = FinancialRepository;
exports.FinancialRepository = FinancialRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], FinancialRepository);
//# sourceMappingURL=financial.repository.js.map