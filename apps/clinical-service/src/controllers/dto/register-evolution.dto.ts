import { BadRequestException } from '@nestjs/common';

export class RegisterEvolutionDto {
  constructor(
    public readonly tenantId: string,
    public readonly patientId: string,
    public readonly encounterId: string,
    public readonly notes: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const patientId = payload.patientId?.trim();
    const encounterId = payload.encounterId?.trim();
    const notes = payload.notes?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!patientId) {
      throw new BadRequestException('patientId es obligatorio');
    }
    if (!encounterId) {
      throw new BadRequestException('encounterId es obligatorio');
    }
    if (!notes) {
      throw new BadRequestException('notes es obligatorio');
    }

    return new RegisterEvolutionDto(tenantId, patientId, encounterId, notes);
  }
}
