import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class ValidateTenantStatusRequestDto {
  constructor(
    public readonly tenantId: string,
    public readonly authorization: string,
    public readonly requestTenantId: string,
    public readonly moduleName: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    authorization?: string;
    requestTenantId?: string;
    moduleName?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const requestTenantId = payload.requestTenantId?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!requestTenantId) {
      throw new BadRequestException('x-tenant-id es obligatorio');
    }

    const authorization = payload.authorization;
    if (!authorization) {
      throw new UnauthorizedException('Authorization header es obligatorio');
    }
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token invalido');
    }

    return new ValidateTenantStatusRequestDto(
      tenantId,
      authorization,
      requestTenantId,
      payload.moduleName,
    );
  }
}
