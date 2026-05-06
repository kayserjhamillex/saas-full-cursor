import { BadRequestException } from '@nestjs/common';

export class CreateAppointmentDto {
  constructor(
    public readonly tenantId: string,
    public readonly patientId: string,
    public readonly professionalId: string,
    public readonly scheduledAt: string,
    public readonly durationMinutes: number,
  ) {}

  static from(payload: {
    tenantId?: string;
    patientId?: string;
    professionalId?: string;
    scheduledAt?: string;
    durationMinutes?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const patientId = payload.patientId?.trim();
    const professionalId = payload.professionalId?.trim();
    const scheduledAtRaw = payload.scheduledAt?.trim();
    const durationMinutes = payload.durationMinutes;

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!patientId) {
      throw new BadRequestException('patientId es obligatorio');
    }
    if (!professionalId) {
      throw new BadRequestException('professionalId es obligatorio');
    }
    if (!scheduledAtRaw) {
      throw new BadRequestException('scheduledAt es obligatorio');
    }
    const timestamp = Date.parse(scheduledAtRaw);
    if (Number.isNaN(timestamp)) {
      throw new BadRequestException('scheduledAt invalido');
    }
    if (
      typeof durationMinutes !== 'number' ||
      Number.isNaN(durationMinutes) ||
      durationMinutes <= 0
    ) {
      throw new BadRequestException('durationMinutes debe ser mayor a 0');
    }

    return new CreateAppointmentDto(
      tenantId,
      patientId,
      professionalId,
      new Date(timestamp).toISOString(),
      durationMinutes,
    );
  }
}
