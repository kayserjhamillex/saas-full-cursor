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
exports.AssignmentService = void 0;
const common_1 = require("@nestjs/common");
const asset_repository_1 = require("../repositories/asset.repository");
const transaction_runner_service_1 = require("./transaction-runner.service");
let AssignmentService = class AssignmentService {
    assetRepository;
    transactionRunnerService;
    constructor(assetRepository, transactionRunnerService) {
        this.assetRepository = assetRepository;
        this.transactionRunnerService = transactionRunnerService;
    }
    async assignAsset(payload) {
        const tenantId = payload.tenantId?.trim();
        const assetId = payload.assetId?.trim();
        const employeeId = payload.employeeId?.trim();
        const areaName = payload.areaName?.trim() ?? null;
        const notes = payload.notes?.trim() ?? null;
        if (!tenantId || !assetId || !employeeId) {
            throw new common_1.BadRequestException("tenantId, assetId y employeeId son obligatorios");
        }
        const employeeExists = await this.assetRepository.employeeExists(tenantId, employeeId);
        if (!employeeExists) {
            throw new common_1.BadRequestException("El empleado no existe en el tenant");
        }
        return this.transactionRunnerService.runInTransaction(async (client) => {
            const asset = await this.assetRepository.findAssetByIdForUpdate(assetId, tenantId, client);
            if (!asset) {
                throw new common_1.BadRequestException("Activo no encontrado en el tenant");
            }
            const currentAssignment = await this.assetRepository.findActiveAssignmentByAsset(assetId, tenantId, client);
            if (currentAssignment) {
                throw new common_1.BadRequestException("El activo ya se encuentra asignado a otro empleado");
            }
            const assignment = await this.assetRepository.createAssignment(client, {
                tenantId,
                assetId,
                employeeId,
                areaName,
                notes,
            });
            const movement = await this.assetRepository.createMovement(client, {
                tenantId,
                assetId,
                movementType: "assignment",
                fromLocation: null,
                toLocation: areaName ?? `employee:${employeeId}`,
                notes,
            });
            const updatedAsset = await this.assetRepository.updateAssetStatus(assetId, "assigned", client);
            return {
                assignment,
                movement,
                asset: updatedAsset,
                event: "asset_assigned",
            };
        });
    }
};
exports.AssignmentService = AssignmentService;
exports.AssignmentService = AssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [asset_repository_1.AssetRepository,
        transaction_runner_service_1.TransactionRunnerService])
], AssignmentService);
//# sourceMappingURL=assignment.service.js.map