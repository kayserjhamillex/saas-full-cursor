"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignAssetDto = void 0;
const common_1 = require("@nestjs/common");
class AssignAssetDto {
    tenantId;
    assetId;
    employeeId;
    areaName;
    notes;
    constructor(tenantId, assetId, employeeId, areaName, notes) {
        this.tenantId = tenantId;
        this.assetId = assetId;
        this.employeeId = employeeId;
        this.areaName = areaName;
        this.notes = notes;
    }
    static from(payload) {
        const tenantId = payload.tenantId?.trim();
        const assetId = payload.assetId?.trim();
        const employeeId = payload.employeeId?.trim();
        if (!tenantId) {
            throw new common_1.BadRequestException("tenantId es obligatorio");
        }
        if (!assetId) {
            throw new common_1.BadRequestException("assetId es obligatorio");
        }
        if (!employeeId) {
            throw new common_1.BadRequestException("employeeId es obligatorio");
        }
        return new AssignAssetDto(tenantId, assetId, employeeId, payload.areaName?.trim(), payload.notes?.trim());
    }
}
exports.AssignAssetDto = AssignAssetDto;
//# sourceMappingURL=assign-asset.dto.js.map