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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const financial_repository_1 = require("../repositories/financial.repository");
let TransactionService = class TransactionService {
    financialRepository;
    constructor(financialRepository) {
        this.financialRepository = financialRepository;
    }
    async registerTransaction(payload) {
        const tenantId = payload.tenantId?.trim();
        const accountId = payload.accountId?.trim();
        const transactionType = payload.transactionType;
        const amount = Number(payload.amount ?? 0);
        const sourceModule = payload.sourceModule?.trim() ?? 'manual';
        const reference = payload.reference?.trim() ?? null;
        const notes = payload.notes?.trim() ?? null;
        if (!tenantId || !accountId || !transactionType) {
            throw new common_1.BadRequestException('tenantId, accountId y transactionType son obligatorios');
        }
        if (transactionType !== 'income' && transactionType !== 'expense') {
            throw new common_1.BadRequestException('transactionType debe ser income o expense');
        }
        if (amount <= 0 || Number.isNaN(amount)) {
            throw new common_1.BadRequestException('amount debe ser mayor a 0');
        }
        const client = await this.financialRepository.getPool().connect();
        try {
            await client.query('BEGIN');
            const account = await this.financialRepository.findAccountByIdForUpdate(accountId, tenantId, client);
            if (!account) {
                throw new common_1.BadRequestException('Cuenta financiera no encontrada en el tenant');
            }
            const delta = transactionType === 'income' ? amount : -amount;
            const nextBalance = account.currentBalance + delta;
            if (nextBalance < 0) {
                throw new common_1.BadRequestException('Saldo insuficiente para registrar egreso');
            }
            const updatedAccount = await this.financialRepository.updateAccountBalance(account.id, nextBalance, client);
            const transaction = await this.financialRepository.createTransaction(client, {
                tenantId,
                accountId,
                transactionType,
                amount,
                sourceModule,
                reference,
                notes,
            });
            const detail = await this.financialRepository.createTransactionDetail(client, {
                transactionId: transaction.id,
                accountId,
                entryType: transactionType === 'income' ? 'credit' : 'debit',
                amount,
                description: transactionType === 'income'
                    ? 'Registro de ingreso en cuenta financiera'
                    : 'Registro de egreso en cuenta financiera',
            });
            await client.query('COMMIT');
            return {
                transaction,
                detail,
                account: updatedAccount,
                event: transactionType === 'income' ? 'income_registered' : 'expense_registered',
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    async listTransactions(payload) {
        const tenantId = payload.tenantId?.trim();
        if (!tenantId) {
            throw new common_1.BadRequestException('tenantId es obligatorio');
        }
        const accountId = payload.accountId?.trim();
        const transactionType = payload.transactionType?.trim();
        const transactions = await this.financialRepository.getTransactionsByTenant(tenantId, accountId, transactionType);
        return {
            tenantId,
            total: transactions.length,
            transactions,
        };
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financial_repository_1.FinancialRepository])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map