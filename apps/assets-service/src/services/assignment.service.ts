import { BadRequestException, Injectable } from "@nestjs/common";
import { AssetRepository } from "../repositories/asset.repository";
import { TransactionRunnerService } from "./transaction-runner.service";

@Injectable()
export class AssignmentService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly transactionRunnerService: TransactionRunnerService,
  ) {}

  async assignAsset(payload: {
    tenantId?: string;
    assetId?: string;
    employeeId?: string;
    areaName?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const employeeId = payload.employeeId?.trim();
    const areaName = payload.areaName?.trim() ?? null;
    const notes = payload.notes?.trim() ?? null;

    if (!tenantId || !assetId || !employeeId) {
      throw new BadRequestException(
        "tenantId, assetId y employeeId son obligatorios",
      );
    }

    const employeeExists = await this.assetRepository.employeeExists(
      tenantId,
      employeeId,
    );
    if (!employeeExists) {
      throw new BadRequestException("El empleado no existe en el tenant");
    }

    return this.transactionRunnerService.runInTransaction(async (client) => {
      const asset = await this.assetRepository.findAssetByIdForUpdate(
        assetId,
        tenantId,
        client,
      );
      if (!asset) {
        throw new BadRequestException("Activo no encontrado en el tenant");
      }
      const currentAssignment =
        await this.assetRepository.findActiveAssignmentByAsset(
          assetId,
          tenantId,
          client,
        );
      if (currentAssignment) {
        throw new BadRequestException(
          "El activo ya se encuentra asignado a otro empleado",
        );
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
      const updatedAsset = await this.assetRepository.updateAssetStatus(
        assetId,
        "assigned",
        client,
      );

      return {
        assignment,
        movement,
        asset: updatedAsset,
        event: "asset_assigned",
      };
    });
  }
}
