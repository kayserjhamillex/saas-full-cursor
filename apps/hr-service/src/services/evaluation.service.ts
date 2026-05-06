import { BadRequestException, Injectable } from '@nestjs/common';
import { HrRepository } from '../repositories/hr.repository';

@Injectable()
export class EvaluationService {
  constructor(private readonly hrRepository: HrRepository) {}

  async createEvaluation(payload: {
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
    const score = Number(payload.score ?? 0);
    const comments = payload.comments?.trim() ?? null;
    const evaluatedAt = payload.evaluatedAt?.trim() ?? new Date().toISOString();

    if (!tenantId || !employeeId || !evaluatorName) {
      throw new BadRequestException(
        'tenantId, employeeId y evaluatorName son obligatorios',
      );
    }
    if (score < 0 || score > 100) {
      throw new BadRequestException('score debe estar entre 0 y 100');
    }

    const employee = await this.hrRepository.findEmployeeById(employeeId, tenantId);
    if (!employee) {
      throw new BadRequestException('Evaluacion invalida: empleado no existe en el tenant');
    }

    const evaluation = await this.hrRepository.createEvaluation({
      tenantId,
      employeeId,
      evaluatorName,
      score,
      comments,
      evaluatedAt,
    });

    return {
      evaluation,
      event: 'evaluation_completed',
    };
  }
}
