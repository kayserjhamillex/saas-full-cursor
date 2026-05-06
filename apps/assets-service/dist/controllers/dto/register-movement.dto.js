"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterMovementDto = void 0;
const common_1 = require("@nestjs/common");
class RegisterMovementDto {
    tenantId;
    assetId;
    movementType;
    fromLocation;
    toLocation;
    notes;
    constructor(tenantId, assetId, movementType, fromLocation, toLocation, notes) {
        this.tenantId = tenantId;
        this.assetId = assetId;
        this.movementType = movementType;
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.notes = notes;
    }
    static from(payload) {
        const tenantId = payload.tenantId?.trim();
        const assetId = payload.assetId?.trim();
        const movementType = payload.movementType?.trim();
        if (!tenantId) {
            throw new common_1.BadRequestException("tenantId es obligatorio");
        }
        if (!assetId) {
            throw new common_1.BadRequestException("assetId es obligatorio");
        }
        if (!movementType) {
            throw new common_1.BadRequestException("movementType es obligatorio");
        }
        return new RegisterMovementDto(tenantId, assetId, movementType, payload.fromLocation?.trim(), payload.toLocation?.trim(), payload.notes?.trim());
    }
}
exports.RegisterMovementDto = RegisterMovementDto;
//# sourceMappingURL=register-movement.dto.js.map