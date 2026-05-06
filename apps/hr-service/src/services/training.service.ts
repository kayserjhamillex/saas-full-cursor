import { BadRequestException, Injectable } from '@nestjs/common';
import { HrRepository } from '../repositories/hr.repository';

@Injectable()
export class TrainingService {
  constructor(private readonly hrRepository: HrRepository) {}

  async createTraining(payload: {
    tenantId?: string;
    employeeId?: string;
    title?: string;
    provider?: string;
    status?: string;
    completedAt?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const employeeId = payload.employeeId?.trim();
    const title = payload.title?.trim();
    const provider = payload.provider?.trim();
    const status = payload.status?.trim() ?? 'scheduled';
    const completedAt = payload.completedAt?.trim() ?? null;

    if (!tenantId || !employeeId || !title || !provider) {
      throw new BadRequestException(
        'tenantId, employeeId, title y provider son obligatorios',
      );
    }

    const employee = await this.hrRepository.findEmployeeById(employeeId, tenantId);
    if (!employee) {
      throw new BadRequestException('Capacitacion invalida: empleado no existe en el tenant');
    }

    const training = await this.hrRepository.createTraining({
      tenantId,
      employeeId,
      title,
      provider,
      status,
      completedAt,
    });

    return {
      training,
      event: 'training_registered',
    };
  }
}
