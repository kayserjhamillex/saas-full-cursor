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
exports.MovementService = void 0;
const common_1 = require("@nestjs/common");
const asset_repository_1 = require("../repositories/asset.repository");
const transaction_runner_service_1 = require("./transaction-runner.service");
let MovementService = class MovementService {
    assetRepository;
    transactionRunnerService;
    constructor(assetRepository, transactionRunnerService) {
        this.assetRepository = assetRepository;
        this.transactionRunnerService = transactionRunnerService;
    }
    async registerMovement(payload) {
        const tenantId = payload.tenantId?.trim();
        const assetId = payload.assetId?.trim();
        const movementType = payload.movementType?.trim();
        const fromLocation = payload.fromLocation?.trim() ?? null;
        const toLocation = payload.toLocation?.trim() ?? null;
        const notes = payload.notes?.trim() ?? null;
        if (!tenantId || !assetId || !movementType) {
            throw new common_1.BadRequestException("tenantId, assetId y movementType son obligatorios");
        }
        const validMovements = ["transfer", "maintenance", "retirement", "return"];
        if (!validMovements.includes(movementType)) {
            throw new common_1.BadRequestException(`movementType invalido. Usa uno de: ${validMovements.join(", ")}`);
        }
        const nextStatusByMovement = {
            transfer: "active",
            maintenance: "maintenance",
            retirement: "retired",
            return: "active",
        };
        return this.transactionRunnerService.runInTransaction(async (client) => {
            const asset = await this.assetRepository.findAssetByIdForUpdate(assetId, tenantId, client);
            if (!asset) {
                throw new common_1.BadRequestException("Activo no encontrado en el tenant");
            }
            let assignment = null;
            if (movementType === "return") {
                const currentAssignment = await this.assetRepository.findActiveAssignmentByAsset(assetId, tenantId, client);
                if (!currentAssignment) {
                    throw new common_1.BadRequestException("No existe asignacion activa para cerrar retorno");
                }
                assignment = await this.assetRepository.closeAssignment(currentAssignment.id, notes, client);
            }
            const movement = await this.assetRepository.createMovement(client, {
                tenantId,
                assetId,
                movementType,
                fromLocation,
                toLocation,
                notes,
            });
            const updatedAsset = await this.assetRepository.updateAssetStatus(assetId, nextStatusByMovement[movementType], client);
            return {
                movement,
                assignment,
                asset: updatedAsset,
                event: "asset_moved",
            };
        });
    }
};
exports.MovementService = MovementService;
exports.MovementService = MovementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [asset_repository_1.AssetRepository,
        transaction_runner_service_1.TransactionRunnerService])
], MovementService);
//# sourceMappingURL=movement.service.js.map