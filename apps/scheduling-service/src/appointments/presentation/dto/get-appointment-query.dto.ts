import { BadRequestException } from '@nestjs/common';

export class GetAppointmentQueryDto {
  constructor(
    public readonly appointmentId: string,
    public readonly tenantId: string,
  ) {}

  static from(payload: { appointmentId?: string; tenantId?: string }) {
    const appointmentId = payload.appointmentId?.trim();
    const tenantId = payload.tenantId?.trim();

    if (!appointmentId) {
      throw new BadRequestException('appointmentId es obligatorio');
    }
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }

    return new GetAppointmentQueryDto(appointmentId, tenantId);
  }
}
