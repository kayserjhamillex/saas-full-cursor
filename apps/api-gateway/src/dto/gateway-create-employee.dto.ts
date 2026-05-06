import { BadRequestException } from '@nestjs/common';

export class GatewayCreateEmployeeDto {
  constructor(
    public readonly tenantId: string,
    public readonly fullName: string,
    public readonly documentNumber: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    fullName?: string;
    documentNumber?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const fullName = payload.fullName?.trim();
    const documentNumber = payload.documentNumber?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!fullName) {
      throw new BadRequestException('fullName es obligatorio');
    }
    if (!documentNumber) {
      throw new BadRequestException('documentNumber es obligatorio');
    }
    return new GatewayCreateEmployeeDto(tenantId, fullName, documentNumber);
  }
}
