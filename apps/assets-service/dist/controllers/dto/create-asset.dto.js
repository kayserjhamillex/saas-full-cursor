"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAssetDto = void 0;
const common_1 = require("@nestjs/common");
class CreateAssetDto {
    tenantId;
    categoryId;
    code;
    name;
    description;
    acquisitionDate;
    acquisitionCost;
    usefulLifeMonths;
    currentValue;
    status;
    constructor(tenantId, categoryId, code, name, description, acquisitionDate, acquisitionCost, usefulLifeMonths, currentValue, status) {
        this.tenantId = tenantId;
        this.categoryId = categoryId;
        this.code = code;
        this.name = name;
        this.description = description;
        this.acquisitionDate = acquisitionDate;
        this.acquisitionCost = acquisitionCost;
        this.usefulLifeMonths = usefulLifeMonths;
        this.currentValue = currentValue;
        this.status = status;
    }
    static from(payload) {
        const tenantId = payload.tenantId?.trim();
        const categoryId = payload.categoryId?.trim();
        const code = payload.code?.trim();
        const name = payload.name?.trim();
        const acquisitionCost = payload.acquisitionCost;
        const usefulLifeMonths = payload.usefulLifeMonths;
        if (!tenantId) {
            throw new common_1.BadRequestException("tenantId es obligatorio");
        }
        if (!categoryId) {
            throw new common_1.BadRequestException("categoryId es obligatorio");
        }
        if (!code) {
            throw new common_1.BadRequestException("code es obligatorio");
        }
        if (!name) {
            throw new common_1.BadRequestException("name es obligatorio");
        }
        if (typeof acquisitionCost !== "number" ||
            Number.isNaN(acquisitionCost) ||
            acquisitionCost < 0) {
            throw new common_1.BadRequestException("acquisitionCost debe ser mayor o igual a 0");
        }
        if (typeof usefulLifeMonths !== "number" ||
            Number.isNaN(usefulLifeMonths) ||
            usefulLifeMonths <= 0) {
            throw new common_1.BadRequestException("usefulLifeMonths debe ser mayor a 0");
        }
        if (payload.currentValue !== undefined) {
            const currentValue = payload.currentValue;
            if (typeof currentValue !== "number" ||
                Number.isNaN(currentValue) ||
                currentValue < 0) {
                throw new common_1.BadRequestException("currentValue debe ser mayor o igual a 0");
            }
        }
        return new CreateAssetDto(tenantId, categoryId, code, name, payload.description?.trim(), payload.acquisitionDate?.trim(), acquisitionCost, usefulLifeMonths, payload.currentValue, payload.status?.trim());
    }
}
exports.CreateAssetDto = CreateAssetDto;
//# sourceMappingURL=create-asset.dto.js.map