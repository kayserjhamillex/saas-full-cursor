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
exports.DepreciationService = void 0;
const common_1 = require("@nestjs/common");
const asset_repository_1 = require("../repositories/asset.repository");
const transaction_runner_service_1 = require("./transaction-runner.service");
let DepreciationService = class DepreciationService {
    assetRepository;
    transactionRunnerService;
    constructor(assetRepository, transactionRunnerService) {
        this.assetRepository = assetRepository;
        this.transactionRunnerService = transactionRunnerService;
    }
    async registerDepreciation(payload) {
        const tenantId = payload.tenantId?.trim();
        const assetId = payload.assetId?.trim();
        const periodLabel = payload.periodLabel?.trim();
        const amount = Number(payload.amount ?? 0);
        const method = payload.method?.trim() ?? "straight_line";
        const financialAccountId = payload.financialAccountId?.trim() ?? null;
        const notes = payload.notes?.trim() ?? null;
        if (!tenantId || !assetId || !periodLabel) {
            throw new common_1.BadRequestException("tenantId, assetId y periodLabel son obligatorios");
        }
        if (amount <= 0 || Number.isNaN(amount)) {
            throw new common_1.BadRequestException("amount debe ser mayor a 0");
        }
        return this.transactionRunnerService.runInTransaction(async (client) => {
            const asset = await this.assetRepository.findAssetByIdForUpdate(assetId, tenantId, client);
            if (!asset) {
                throw new common_1.BadRequestException("Activo no encontrado en el tenant");
            }
            const previousValue = asset.currentValue;
            const newValue = Math.max(0, previousValue - amount);
            const depreciationAmount = previousValue - newValue;
            if (depreciationAmount <= 0) {
                throw new common_1.BadRequestException("El activo ya no tiene valor para depreciar");
            }
            const updatedAsset = await this.assetRepository.updateAssetValue(assetId, newValue, client);
            const depreciation = await this.assetRepository.createDepreciation(client, {
                tenantId,
                assetId,
                periodLabel,
                amount: depreciationAmount,
                previousValue,
                newValue,
                method,
                financialAccountId,
                notes,
            });
            const movement = await this.assetRepository.createMovement(client, {
                tenantId,
                assetId,
                movementType: "depreciation",
                fromLocation: null,
                toLocation: null,
                notes: notes ?? `Depreciacion ${periodLabel}`,
            });
            return {
                depreciation,
                movement,
                asset: updatedAsset,
                financialImpact: {
                    sourceModule: "assets",
                    amount: depreciationAmount,
                    accountId: financialAccountId,
                    reference: `DEPRECIATION-${asset.code}-${periodLabel}`,
                },
                event: "asset_depreciated",
            };
        });
    }
};
exports.DepreciationService = DepreciationService;
exports.DepreciationService = DepreciationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [asset_repository_1.AssetRepository,
        transaction_runner_service_1.TransactionRunnerService])
], DepreciationService);
//# sourceMappingURL=depreciation.service.js.map