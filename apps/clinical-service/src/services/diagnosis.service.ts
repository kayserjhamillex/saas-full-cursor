import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClinicalRepository } from '../repositories/clinical.repository';

@Injectable()
export class DiagnosisService {
  constructor(private readonly clinicalRepository: ClinicalRepository) {}

  async registerDiagnosis(payload: { encounterId?: string; description?: string }) {
    const encounterId = payload.encounterId?.trim();
    const description = payload.description?.trim();
    if (!encounterId || !description) {
      throw new BadRequestException('encounterId y description son obligatorios');
    }

    const encounter = await this.clinicalRepository.findEncounterById(encounterId);
    if (!encounter) {
      throw new NotFoundException('Consulta clínica no encontrada');
    }

    return this.clinicalRepository.createDiagnosis({
      encounterId,
      description,
    });
  }
}
