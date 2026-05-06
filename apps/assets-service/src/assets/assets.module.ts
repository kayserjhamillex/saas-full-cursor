import { Module } from "@nestjs/common";
import { AssignmentController } from "../controllers/assignment.controller";
import { AssetController } from "../controllers/asset.controller";
import { DepreciationController } from "../controllers/depreciation.controller";
import { MovementController } from "../controllers/movement.controller";
import { InternalServiceTokenGuard } from "../guards/internal-service-token.guard";
import { AssetRepository } from "../repositories/asset.repository";
import { AssignmentService } from "../services/assignment.service";
import { AssetService } from "../services/asset.service";
import { DatabaseService } from "../services/database.service";
import { DepreciationService } from "../services/depreciation.service";
import { MovementService } from "../services/movement.service";
import { TransactionRunnerService } from "../services/transaction-runner.service";

@Module({
  controllers: [
    AssetController,
    AssignmentController,
    MovementController,
    DepreciationController,
  ],
  providers: [
    DatabaseService,
    AssetRepository,
    AssetService,
    AssignmentService,
    MovementService,
    DepreciationService,
    TransactionRunnerService,
    InternalServiceTokenGuard,
  ],
})
export class AssetsModule {}
