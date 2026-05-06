import { BadRequestException, Injectable } from "@nestjs/common";
import { AssetRepository } from "../repositories/asset.repository";
import { TransactionRunnerService } from "./transaction-runner.service";

@Injectable()
export class DepreciationService {
  constructor(
    private readonly assetRepository: AssetRepository,
    private readonly transactionRunnerService: TransactionRunnerService,
  ) {}

  async registerDepreciation(payload: {
    tenantId?: string;
    assetId?: string;
    periodLabel?: string;
    amount?: number;
    method?: string;
    financialAccountId?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const periodLabel = payload.periodLabel?.trim();
    const amount = Number(payload.amount ?? 0);
    const method = payload.method?.trim() ?? "straight_line";
    const financialAccountId = payload.financialAccountId?.trim() ?? null;
    const notes = payload.notes?.trim() ?? null;

    if (!tenantId || !assetId || !periodLabel) {
      throw new BadRequestException(
        "tenantId, assetId y periodLabel son obligatorios",
      );
    }
    if (amount <= 0 || Number.isNaN(amount)) {
      throw new BadRequestException("amount debe ser mayor a 0");
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

      const previousValue = asset.currentValue;
      const newValue = Math.max(0, previousValue - amount);
      const depreciationAmount = previousValue - newValue;
      if (depreciationAmount <= 0) {
        throw new BadRequestException(
          "El activo ya no tiene valor para depreciar",
        );
      }

      const updatedAsset = await this.assetRepository.updateAssetValue(
        assetId,
        newValue,
        client,
      );
      const depreciation = await this.assetRepository.createDepreciation(
        client,
        {
          tenantId,
          assetId,
          periodLabel,
          amount: depreciationAmount,
          previousValue,
          newValue,
          method,
          financialAccountId,
          notes,
        },
      );
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
}
