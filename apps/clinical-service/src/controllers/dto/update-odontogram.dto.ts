import { BadRequestException } from '@nestjs/common';

export class UpdateOdontogramDto {
  constructor(
    public readonly tenantId: string,
    public readonly patientId: string,
    public readonly chartData: Record<string, unknown>,
  ) {}

  static from(payload: {
    tenantId?: string;
    patientId?: string;
    chartData?: Record<string, unknown>;
  }) {
    const tenantId = payload.tenantId?.trim();
    const patientId = payload.patientId?.trim();
    const chartData = payload.chartData;

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!patientId) {
      throw new BadRequestException('patientId es obligatorio');
    }
    if (!chartData || typeof chartData !== 'object') {
      throw new BadRequestException('chartData es obligatorio');
    }

    return new UpdateOdontogramDto(tenantId, patientId, chartData);
  }
}
