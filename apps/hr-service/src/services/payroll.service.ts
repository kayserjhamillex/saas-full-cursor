import { BadRequestException, Injectable } from '@nestjs/common';
import { HrRepository } from '../repositories/hr.repository';

@Injectable()
export class PayrollService {
  constructor(private readonly hrRepository: HrRepository) {}

  async generatePayroll(payload: {
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
    const baseAmount = Number(payload.baseAmount ?? 0);
    const bonusAmount = Number(payload.bonusAmount ?? 0);
    const deductionAmount = Number(payload.deductionAmount ?? 0);
    const status = payload.status?.trim() ?? 'generated';
    const netAmount = baseAmount + bonusAmount - deductionAmount;

    if (!tenantId || !employeeId || !periodLabel) {
      throw new BadRequestException(
        'tenantId, employeeId y periodLabel son obligatorios',
      );
    }
    if (baseAmount <= 0) {
      throw new BadRequestException('baseAmount debe ser mayor a 0');
    }
    if (netAmount < 0) {
      throw new BadRequestException('La planilla no puede generar netAmount negativo');
    }

    const employee = await this.hrRepository.findEmployeeById(employeeId, tenantId);
    if (!employee) {
      throw new BadRequestException('No se puede generar planilla para un empleado inexistente');
    }

    const payroll = await this.hrRepository.createPayroll({
      tenantId,
      employeeId,
      periodLabel,
      baseAmount,
      bonusAmount,
      deductionAmount,
      netAmount,
      status,
    });

    return {
      payroll,
      event: 'payroll_generated',
    };
  }
}
