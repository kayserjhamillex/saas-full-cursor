import { BadRequestException, Injectable } from '@nestjs/common';
import { AssetRepository } from '../repositories/asset.repository';

@Injectable()
export class AssetService {
  constructor(private readonly assetRepository: AssetRepository) {}

  async createAsset(payload: {
    tenantId?: string;
    categoryId?: string;
    code?: string;
    name?: string;
    description?: string;
    acquisitionDate?: string;
    acquisitionCost?: number;
    usefulLifeMonths?: number;
    currentValue?: number;
    status?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const categoryId = payload.categoryId?.trim();
    const code = payload.code?.trim();
    const name = payload.name?.trim();
    const description = payload.description?.trim() ?? null;
    const acquisitionDate = payload.acquisitionDate?.trim() ?? null;
    const acquisitionCost = Number(payload.acquisitionCost ?? 0);
    const usefulLifeMonths = Number(payload.usefulLifeMonths ?? 0);
    const currentValue =
      payload.currentValue !== undefined
        ? Number(payload.currentValue)
        : Number(payload.acquisitionCost ?? 0);
    const status = payload.status?.trim() ?? 'active';

    if (!tenantId || !categoryId || !code || !name) {
      throw new BadRequestException('tenantId, categoryId, code y name son obligatorios');
    }
    if (acquisitionCost < 0 || Number.isNaN(acquisitionCost)) {
      throw new BadRequestException('acquisitionCost debe ser un numero mayor o igual a 0');
    }
    if (usefulLifeMonths <= 0 || Number.isNaN(usefulLifeMonths)) {
      throw new BadRequestException('usefulLifeMonths debe ser mayor a 0');
    }
    if (currentValue < 0 || Number.isNaN(currentValue)) {
      throw new BadRequestException('currentValue debe ser un numero mayor o igual a 0');
    }

    const categoryExists = await this.assetRepository.categoryExists(tenantId, categoryId);
    if (!categoryExists) {
      throw new BadRequestException('La categoria del activo no existe para el tenant');
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
}
