import { BadRequestException } from '@nestjs/common';

export class RegisterClinicalNoteDto {
  constructor(
    public readonly tenantId: string,
    public readonly patientId: string,
    public readonly encounterId: string,
    public readonly description: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    patientId?: string;
    encounterId?: string;
    description?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const patientId = payload.patientId?.trim();
    const encounterId = payload.encounterId?.trim();
    const description = payload.description?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!patientId) {
      throw new BadRequestException('patientId es obligatorio');
    }
    if (!encounterId) {
      throw new BadRequestException('encounterId es obligatorio');
    }
    if (!description) {
      throw new BadRequestException('description es obligatorio');
    }

    return new RegisterClinicalNoteDto(
      tenantId,
      patientId,
      encounterId,
      description,
    );
  }
}
