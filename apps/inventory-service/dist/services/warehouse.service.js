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
exports.WarehouseService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database.service");
let WarehouseService = class WarehouseService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async createWarehouse(payload) {
        const tenantId = payload.tenantId?.trim();
        const name = payload.name?.trim();
        if (!tenantId || !name) {
            throw new common_1.BadRequestException('tenantId y name son obligatorios');
        }
        const result = await this.databaseService.getPool().query(`
      INSERT INTO warehouses (tenant_id, name, created_at, deleted_at)
      VALUES ($1, $2, NOW(), NULL)
      RETURNING id, tenant_id, name, created_at, deleted_at
      `, [tenantId, name]);
        return result.rows[0];
    }
};
exports.WarehouseService = WarehouseService;
exports.WarehouseService = WarehouseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], WarehouseService);
//# sourceMappingURL=warehouse.service.js.map