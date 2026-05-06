import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantRepository } from '../repositories/tenant.repository';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async createTenant(payload: { name?: string }) {
    const name = payload.name?.trim();
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }
    return this.tenantRepository.create(name);
  }

  async getTenantById(tenantId: string) {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }
    return tenant;
  }
}
