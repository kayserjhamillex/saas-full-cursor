import { BadRequestException } from '@nestjs/common';

export class RegisterAttendanceDto {
  constructor(
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly checkInAt: string,
    public readonly checkOutAt: string | undefined,
    public readonly status: string | undefined,
    public readonly notes: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    employeeId?: string;
    checkInAt?: string;
    checkOutAt?: string;
    status?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const employeeId = payload.employeeId?.trim();
    const checkInAtRaw = payload.checkInAt?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!employeeId) {
      throw new BadRequestException('employeeId es obligatorio');
    }
    if (!checkInAtRaw) {
      throw new BadRequestException('checkInAt es obligatorio');
    }

    const checkInTimestamp = Date.parse(checkInAtRaw);
    if (Number.isNaN(checkInTimestamp)) {
      throw new BadRequestException('checkInAt invalido');
    }

    const checkOutAtRaw = payload.checkOutAt?.trim();
    let checkOutAt: string | undefined;
    if (checkOutAtRaw) {
      const checkOutTimestamp = Date.parse(checkOutAtRaw);
      if (Number.isNaN(checkOutTimestamp)) {
        throw new BadRequestException('checkOutAt invalido');
      }
      checkOutAt = new Date(checkOutTimestamp).toISOString();
    }

    return new RegisterAttendanceDto(
      tenantId,
      employeeId,
      new Date(checkInTimestamp).toISOString(),
      checkOutAt,
      payload.status?.trim(),
      payload.notes?.trim(),
    );
  }
}
