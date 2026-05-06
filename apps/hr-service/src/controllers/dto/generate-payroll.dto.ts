import { BadRequestException } from '@nestjs/common';

export class GeneratePayrollDto {
  constructor(
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly periodLabel: string,
    public readonly baseAmount: number,
    public readonly bonusAmount: number,
    public readonly deductionAmount: number,
    public readonly status: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    employeeId?: string;
    periodLabel?: string;
    baseAmount?: number;
    bonusAmount?: number;
    deductionAmount?: number;
    status?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const employeeId = payload.employeeId?.trim();
    const periodLabel = payload.periodLabel?.trim();
    const baseAmount = payload.baseAmount;

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!employeeId) {
      throw new BadRequestException('employeeId es obligatorio');
    }
    if (!periodLabel) {
      throw new BadRequestException('periodLabel es obligatorio');
    }
    if (
      typeof baseAmount !== 'number' ||
      Number.isNaN(baseAmount) ||
      baseAmount <= 0
    ) {
      throw new BadRequestException('baseAmount debe ser mayor a 0');
    }

    return new GeneratePayrollDto(
      tenantId,
      employeeId,
      periodLabel,
      baseAmount,
      payload.bonusAmount ?? 0,
      payload.deductionAmount ?? 0,
      payload.status?.trim(),
    );
  }
}
