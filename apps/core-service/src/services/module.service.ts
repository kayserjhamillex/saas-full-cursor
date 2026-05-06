import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ModuleRepository } from '../repositories/module.repository';

@Injectable()
export class ModuleService {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  async updateModuleStatus(payload: {
    tenantId?: string;
    moduleName?: string;
    isActive?: boolean;
  }) {
    const tenantId = payload.tenantId?.trim();
    const moduleName = payload.moduleName?.trim();
    if (!tenantId || !moduleName || payload.isActive === undefined) {
      throw new BadRequestException(
        'tenantId, moduleName e isActive son obligatorios',
      );
    }

    await this.moduleRepository.upsert(tenantId, moduleName, payload.isActive);
    return {
      tenantId,
      moduleName,
      isActive: payload.isActive,
      event: payload.isActive ? 'modules_activated' : 'modules_deactivated',
    };
  }

  async validateModule(tenantId: string, moduleName: string) {
    const modules = await this.moduleRepository.listByTenant(tenantId);
    const module = modules.find((item) => item.module_name === moduleName);
    if (!module || !module.is_active) {
      throw new ForbiddenException('Modulo no habilitado para el tenant');
    }
    return {
      moduleName,
      isActive: true,
    };
  }
}
