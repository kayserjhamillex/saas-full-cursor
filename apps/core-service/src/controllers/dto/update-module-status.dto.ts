import { BadRequestException } from '@nestjs/common';

export class UpdateModuleStatusDto {
  constructor(
    public readonly tenantId: string,
    public readonly moduleName: string,
    public readonly isActive: boolean,
  ) {}

  static from(payload: {
    tenantId?: string;
    moduleName?: string;
    isActive?: boolean;
  }) {
    const tenantId = payload.tenantId?.trim();
    const moduleName = payload.moduleName?.trim().toLowerCase();

    if (!tenantId || !moduleName || payload.isActive === undefined) {
      throw new BadRequestException(
        'tenantId, moduleName e isActive son obligatorios',
      );
    }

    const moduleRegex = /^[a-z][a-z0-9-]{1,49}$/;
    if (!moduleRegex.test(moduleName)) {
      throw new BadRequestException('moduleName invalido');
    }
    if (typeof payload.isActive !== 'boolean') {
      throw new BadRequestException('isActive debe ser booleano');
    }

    return new UpdateModuleStatusDto(tenantId, moduleName, payload.isActive);
  }
}
