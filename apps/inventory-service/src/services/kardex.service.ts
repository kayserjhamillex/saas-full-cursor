import { Injectable } from '@nestjs/common';
import { MovementRepository } from '../repositories/movement.repository';

@Injectable()
export class KardexService {
  constructor(private readonly movementRepository: MovementRepository) {}

  async getKardex(tenantId: string, productId: string, warehouseId?: string) {
    return this.movementRepository.getKardexByProduct(tenantId, productId, warehouseId);
  }
}
