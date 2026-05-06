import { BadRequestException } from '@nestjs/common';

export class GatewayGeneratePayrollDto {
  constructor(
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly baseAmount: number,
  ) {}

  static from(payload: {
    tenantId?: string;
    employeeId?: string;
    baseAmount?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const employeeId = payload.employeeId?.trim();
    const baseAmount = payload.baseAmount;
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!employeeId) {
      throw new BadRequestException('employeeId es obligatorio');
    }
    if (
      typeof baseAmount !== 'number' ||
      Number.isNaN(baseAmount) ||
      baseAmount <= 0
    ) {
      throw new BadRequestException('baseAmount debe ser mayor a 0');
    }
    return new GatewayGeneratePayrollDto(tenantId, employeeId, baseAmount);
  }
}
