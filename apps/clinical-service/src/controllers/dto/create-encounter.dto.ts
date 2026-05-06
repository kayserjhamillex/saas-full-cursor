import { BadRequestException } from '@nestjs/common';

export class CreateEncounterDto {
  constructor(
    public readonly tenantId: string,
    public readonly patientId: string,
    public readonly encounterDate: string,
    public readonly notes: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    patientId?: string;
    encounterDate?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const patientId = payload.patientId?.trim();
    const encounterDateRaw = payload.encounterDate?.trim();
    const notes = payload.notes?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!patientId) {
      throw new BadRequestException('patientId es obligatorio');
    }
    if (!encounterDateRaw) {
      throw new BadRequestException('encounterDate es obligatorio');
    }
    const timestamp = Date.parse(encounterDateRaw);
    if (Number.isNaN(timestamp)) {
      throw new BadRequestException('encounterDate invalido');
    }
    if (!notes) {
      throw new BadRequestException('notes es obligatorio');
    }

    return new CreateEncounterDto(
      tenantId,
      patientId,
      new Date(timestamp).toISOString(),
      notes,
    );
  }
}
