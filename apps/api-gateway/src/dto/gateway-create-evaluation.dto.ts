import { BadRequestException } from '@nestjs/common';

export class GatewayCreateEvaluationDto {
  constructor(
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly score: number,
  ) {}

  static from(payload: {
    tenantId?: string;
    employeeId?: string;
    score?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const employeeId = payload.employeeId?.trim();
    const score = payload.score;
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!employeeId) {
      throw new BadRequestException('employeeId es obligatorio');
    }
    if (typeof score !== 'number' || Number.isNaN(score) || score <= 0) {
      throw new BadRequestException('score debe ser mayor a 0');
    }
    return new GatewayCreateEvaluationDto(tenantId, employeeId, score);
  }
}
