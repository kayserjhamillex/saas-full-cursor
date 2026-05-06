import { BadRequestException } from '@nestjs/common';

export class ValidateTenantAccessDto {
  constructor(
    public readonly tenantId: string,
    public readonly moduleName: string | undefined,
  ) {}

  static from(payload: { tenantId?: string; moduleName?: string }) {
    const tenantId = payload.tenantId?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }

    const rawModuleName = payload.moduleName;
    if (!rawModuleName) {
      return new ValidateTenantAccessDto(tenantId, undefined);
    }

    const moduleName = rawModuleName.trim().toLowerCase();
    if (!moduleName) {
      throw new BadRequestException('module invalido');
    }

    const moduleRegex = /^[a-z][a-z0-9-]{1,49}$/;
    if (!moduleRegex.test(moduleName)) {
      throw new BadRequestException('module invalido');
    }

    return new ValidateTenantAccessDto(tenantId, moduleName);
  }
}
