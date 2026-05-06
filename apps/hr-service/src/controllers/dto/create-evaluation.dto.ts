import { BadRequestException } from '@nestjs/common';

export class CreateEvaluationDto {
  constructor(
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly evaluatorName: string,
    public readonly score: number,
    public readonly comments: string | undefined,
    public readonly evaluatedAt: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    employeeId?: string;
    evaluatorName?: string;
    score?: number;
    comments?: string;
    evaluatedAt?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const employeeId = payload.employeeId?.trim();
    const evaluatorName = payload.evaluatorName?.trim();
    const evaluatedAtRaw = payload.evaluatedAt?.trim();
    const score = payload.score;

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!employeeId) {
      throw new BadRequestException('employeeId es obligatorio');
    }
    if (!evaluatorName) {
      throw new BadRequestException('evaluatorName es obligatorio');
    }
    if (
      typeof score !== 'number' ||
      Number.isNaN(score) ||
      score < 0 ||
      score > 100
    ) {
      throw new BadRequestException('score debe estar entre 0 y 100');
    }
    if (!evaluatedAtRaw) {
      throw new BadRequestException('evaluatedAt es obligatorio');
    }
    const timestamp = Date.parse(evaluatedAtRaw);
    if (Number.isNaN(timestamp)) {
      throw new BadRequestException('evaluatedAt invalido');
    }

    return new CreateEvaluationDto(
      tenantId,
      employeeId,
      evaluatorName,
      score,
      payload.comments?.trim(),
      new Date(timestamp).toISOString(),
    );
  }
}
