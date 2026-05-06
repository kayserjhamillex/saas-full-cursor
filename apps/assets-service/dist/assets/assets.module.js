"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsModule = void 0;
const common_1 = require("@nestjs/common");
const assignment_controller_1 = require("../controllers/assignment.controller");
const asset_controller_1 = require("../controllers/asset.controller");
const depreciation_controller_1 = require("../controllers/depreciation.controller");
const movement_controller_1 = require("../controllers/movement.controller");
const internal_service_token_guard_1 = require("../guards/internal-service-token.guard");
const asset_repository_1 = require("../repositories/asset.repository");
const assignment_service_1 = require("../services/assignment.service");
const asset_service_1 = require("../services/asset.service");
const database_service_1 = require("../services/database.service");
const depreciation_service_1 = require("../services/depreciation.service");
const movement_service_1 = require("../services/movement.service");
const transaction_runner_service_1 = require("../services/transaction-runner.service");
let AssetsModule = class AssetsModule {
};
exports.AssetsModule = AssetsModule;
exports.AssetsModule = AssetsModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            asset_controller_1.AssetController,
            assignment_controller_1.AssignmentController,
            movement_controller_1.MovementController,
            depreciation_controller_1.DepreciationController,
        ],
        providers: [
            database_service_1.DatabaseService,
            asset_repository_1.AssetRepository,
            asset_service_1.AssetService,
            assignment_service_1.AssignmentService,
            movement_service_1.MovementService,
            depreciation_service_1.DepreciationService,
            transaction_runner_service_1.TransactionRunnerService,
            internal_service_token_guard_1.InternalServiceTokenGuard,
        ],
    })
], AssetsModule);
//# sourceMappingURL=assets.module.js.map