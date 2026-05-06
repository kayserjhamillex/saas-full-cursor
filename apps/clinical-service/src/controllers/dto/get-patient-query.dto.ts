import { BadRequestException } from '@nestjs/common';

export class GetPatientQueryDto {
  constructor(
    public readonly patientId: string,
    public readonly tenantId: string,
  ) {}

  static from(payload: { patientId?: string; tenantId?: string }) {
    const patientId = payload.patientId?.trim();
    const tenantId = payload.tenantId?.trim();

    if (!patientId) {
      throw new BadRequestException('patientId es obligatorio');
    }
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }

    return new GetPatientQueryDto(patientId, tenantId);
  }
}
