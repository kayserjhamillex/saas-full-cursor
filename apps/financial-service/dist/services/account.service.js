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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const financial_repository_1 = require("../repositories/financial.repository");
let AccountService = class AccountService {
    financialRepository;
    constructor(financialRepository) {
        this.financialRepository = financialRepository;
    }
    async createAccount(payload) {
        const tenantId = payload.tenantId?.trim();
        const name = payload.name?.trim();
        const accountType = payload.accountType?.trim() ?? 'cash';
        const currency = payload.currency?.trim() ?? 'PEN';
        const initialBalance = Number(payload.initialBalance ?? 0);
        if (!tenantId || !name) {
            throw new common_1.BadRequestException('tenantId y name son obligatorios');
        }
        if (Number.isNaN(initialBalance)) {
            throw new common_1.BadRequestException('initialBalance debe ser numerico');
        }
        const account = await this.financialRepository.createAccount({
            tenantId,
            name,
            accountType,
            currency,
            initialBalance,
        });
        return {
            account,
            event: 'financial_account_created',
        };
    }
    async listAccounts(tenantId) {
        const cleanTenantId = tenantId?.trim();
        if (!cleanTenantId) {
            throw new common_1.BadRequestException('tenantId es obligatorio');
        }
        const accounts = await this.financialRepository.getAccountsByTenant(cleanTenantId);
        return {
            tenantId: cleanTenantId,
            accounts,
            total: accounts.length,
        };
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [financial_repository_1.FinancialRepository])
], AccountService);
//# sourceMappingURL=account.service.js.map