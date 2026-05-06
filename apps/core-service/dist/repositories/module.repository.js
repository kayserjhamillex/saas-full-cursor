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
exports.ModuleRepository = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../services/database.service");
let ModuleRepository = class ModuleRepository {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async upsert(tenantId, moduleName, isActive) {
        const query = `
      INSERT INTO tenant_modules (tenant_id, module_name, is_active)
      VALUES ($1, $2, $3)
      ON CONFLICT (tenant_id, module_name)
      DO UPDATE SET is_active = EXCLUDED.is_active
    `;
        await this.databaseService
            .getPool()
            .query(query, [tenantId, moduleName, isActive]);
    }
    async listByTenant(tenantId) {
        const query = `
      SELECT module_name, is_active
      FROM tenant_modules
      WHERE tenant_id = $1
    `;
        const result = await this.databaseService
            .getPool()
            .query(query, [tenantId]);
        return result.rows;
    }
    async disableAllByTenant(tenantId) {
        await this.databaseService
            .getPool()
            .query('UPDATE tenant_modules SET is_active = false WHERE tenant_id = $1', [tenantId]);
    }
};
exports.ModuleRepository = ModuleRepository;
exports.ModuleRepository = ModuleRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ModuleRepository);
//# sourceMappingURL=module.repository.js.map