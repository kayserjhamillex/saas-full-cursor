"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDepreciationDto = void 0;
const common_1 = require("@nestjs/common");
class RegisterDepreciationDto {
    tenantId;
    assetId;
    periodLabel;
    amount;
    method;
    financialAccountId;
    notes;
    constructor(tenantId, assetId, periodLabel, amount, method, financialAccountId, notes) {
        this.tenantId = tenantId;
        this.assetId = assetId;
        this.periodLabel = periodLabel;
        this.amount = amount;
        this.method = method;
        this.financialAccountId = financialAccountId;
        this.notes = notes;
    }
    static from(payload) {
        const tenantId = payload.tenantId?.trim();
        const assetId = payload.assetId?.trim();
        const periodLabel = payload.periodLabel?.trim();
        const amount = payload.amount;
        if (!tenantId) {
            throw new common_1.BadRequestException("tenantId es obligatorio");
        }
        if (!assetId) {
            throw new common_1.BadRequestException("assetId es obligatorio");
        }
        if (!periodLabel) {
            throw new common_1.BadRequestException("periodLabel es obligatorio");
        }
        if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
            throw new common_1.BadRequestException("amount debe ser mayor a 0");
        }
        return new RegisterDepreciationDto(tenantId, assetId, periodLabel, amount, payload.method?.trim(), payload.financialAccountId?.trim(), payload.notes?.trim());
    }
}
exports.RegisterDepreciationDto = RegisterDepreciationDto;
//# sourceMappingURL=register-depreciation.dto.js.map