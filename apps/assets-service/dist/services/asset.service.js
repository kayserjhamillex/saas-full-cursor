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
exports.AssetService = void 0;
const common_1 = require("@nestjs/common");
const asset_repository_1 = require("../repositories/asset.repository");
let AssetService = class AssetService {
    assetRepository;
    constructor(assetRepository) {
        this.assetRepository = assetRepository;
    }
    async createAsset(payload) {
        const tenantId = payload.tenantId?.trim();
        const categoryId = payload.categoryId?.trim();
        const code = payload.code?.trim();
        const name = payload.name?.trim();
        const description = payload.description?.trim() ?? null;
        const acquisitionDate = payload.acquisitionDate?.trim() ?? null;
        const acquisitionCost = Number(payload.acquisitionCost ?? 0);
        const usefulLifeMonths = Number(payload.usefulLifeMonths ?? 0);
        const currentValue = payload.currentValue !== undefined
            ? Number(payload.currentValue)
            : Number(payload.acquisitionCost ?? 0);
        const status = payload.status?.trim() ?? 'active';
        if (!tenantId || !categoryId || !code || !name) {
            throw new common_1.BadRequestException('tenantId, categoryId, code y name son obligatorios');
        }
        if (acquisitionCost < 0 || Number.isNaN(acquisitionCost)) {
            throw new common_1.BadRequestException('acquisitionCost debe ser un numero mayor o igual a 0');
        }
        if (usefulLifeMonths <= 0 || Number.isNaN(usefulLifeMonths)) {
            throw new common_1.BadRequestException('usefulLifeMonths debe ser mayor a 0');
        }
        if (currentValue < 0 || Number.isNaN(currentValue)) {
            throw new common_1.BadRequestException('currentValue debe ser un numero mayor o igual a 0');
        }
        const categoryExists = await this.assetRepository.categoryExists(tenantId, categoryId);
        if (!categoryExists) {
            throw new common_1.BadRequestException('La categoria del activo no existe para el tenant');
        }
        const asset = await this.assetRepository.createAsset({
            tenantId,
            categoryId,
            code,
            name,
            description,
            acquisitionDate,
            acquisitionCost,
            usefulLifeMonths,
            currentValue,
            status,
        });
        return {
            asset,
            event: 'asset_created',
        };
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [asset_repository_1.AssetRepository])
], AssetService);
//# sourceMappingURL=asset.service.js.map