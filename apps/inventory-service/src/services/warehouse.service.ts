import { BadRequestException, Injectable } from '@nestjs/common';
import { WarehouseRepository } from '../repositories/warehouse.repository';

@Injectable()
export class WarehouseService {
  constructor(private readonly warehouseRepository: WarehouseRepository) {}

  async createWarehouse(payload: { tenantId?: string; name?: string }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();
    if (!tenantId || !name) {
      throw new BadRequestException('tenantId y name son obligatorios');
    }

    return this.warehouseRepository.create(tenantId, name);
  }
}
