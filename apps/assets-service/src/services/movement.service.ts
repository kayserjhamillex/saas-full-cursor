import { BadRequestException, Injectable } from "@nestjs/common";
import { AssetRepository } from "../repositories/asset.repository";
import { TransactionRunnerService } from "./transaction-runner.service";

@Injectable()
export class MovementService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly transactionRunnerService: TransactionRunnerService,
  ) {}

  async registerMovement(payload: {
    tenantId?: string;
    assetId?: string;
    movementType?: string;
    fromLocation?: string;
    toLocation?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const movementType = payload.movementType?.trim();
    const fromLocation = payload.fromLocation?.trim() ?? null;
    const toLocation = payload.toLocation?.trim() ?? null;
    const notes = payload.notes?.trim() ?? null;

    if (!tenantId || !assetId || !movementType) {
      throw new BadRequestException(
        "tenantId, assetId y movementType son obligatorios",
      );
    }

    const validMovements = ["transfer", "maintenance", "retirement", "return"];
    if (!validMovements.includes(movementType)) {
      throw new BadRequestException(
        `movementType invalido. Usa uno de: ${validMovements.join(", ")}`,
      );
    }

    const nextStatusByMovement: Record<string, string> = {
      transfer: "active",
      maintenance: "maintenance",
      retirement: "retired",
      return: "active",
    };

    return this.transactionRunnerService.runInTransaction(async (client) => {
      const asset = await this.assetRepository.findAssetByIdForUpdate(
        assetId,
        tenantId,
        client,
      );
      if (!asset) {
        throw new BadRequestException("Activo no encontrado en el tenant");
      }

      let assignment: Awaited<
        ReturnType<AssetRepository["closeAssignment"]>
      > | null = null;
      if (movementType === "return") {
        const currentAssignment =
          await this.assetRepository.findActiveAssignmentByAsset(
            assetId,
            tenantId,
            client,
          );
        if (!currentAssignment) {
          throw new BadRequestException(
            "No existe asignacion activa para cerrar retorno",
          );
        }
        assignment = await this.assetRepository.closeAssignment(
          currentAssignment.id,
          notes,
          client,
        );
      }

      const movement = await this.assetRepository.createMovement(client, {
        tenantId,
        assetId,
        movementType,
        fromLocation,
        toLocation,
        notes,
      });
      const updatedAsset = await this.assetRepository.updateAssetStatus(
        assetId,
        nextStatusByMovement[movementType],
        client,
      );

      return {
        movement,
        assignment,
        asset: updatedAsset,
        event: "asset_moved",
      };
    });
  }
}
