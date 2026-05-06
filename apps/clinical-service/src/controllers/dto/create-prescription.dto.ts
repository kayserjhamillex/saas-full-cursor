import { BadRequestException } from '@nestjs/common';

export class CreatePrescriptionDto {
  constructor(
    public readonly tenantId: string,
    public readonly patientId: string,
    public readonly encounterId: string,
    public readonly medication: string,
    public readonly dosage: string,
    public readonly instructions: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    medication?: string;
    dosage?: string;
    instructions?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const patientId = payload.patientId?.trim();
    const encounterId = payload.encounterId?.trim();
    const medication = payload.medication?.trim();
    const dosage = payload.dosage?.trim();
    const instructions = payload.instructions?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!patientId) {
      throw new BadRequestException('patientId es obligatorio');
    }
    if (!encounterId) {
      throw new BadRequestException('encounterId es obligatorio');
    }
    if (!medication) {
      throw new BadRequestException('medication es obligatorio');
    }
    if (!dosage) {
      throw new BadRequestException('dosage es obligatorio');
    }
    if (!instructions) {
      throw new BadRequestException('instructions es obligatorio');
    }

    return new CreatePrescriptionDto(
      tenantId,
      patientId,
      encounterId,
      medication,
      dosage,
      instructions,
    );
  }
}
