import { BadRequestException, Injectable } from '@nestjs/common';
import { HrRepository } from '../repositories/hr.repository';

@Injectable()
export class AttendanceService {
  constructor(private readonly hrRepository: HrRepository) {}

  async registerAttendance(payload: {
    tenantId?: string;
    employeeId?: string;
    checkInAt?: string;
    checkOutAt?: string;
    status?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const employeeId = payload.employeeId?.trim();
    const checkInAt = payload.checkInAt?.trim();
    const checkOutAt = payload.checkOutAt?.trim() ?? null;
    const status = payload.status?.trim() ?? 'present';
    const notes = payload.notes?.trim() ?? null;

    if (!tenantId || !employeeId || !checkInAt) {
      throw new BadRequestException(
        'tenantId, employeeId y checkInAt son obligatorios',
      );
    }

    if (checkOutAt && new Date(checkOutAt).getTime() < new Date(checkInAt).getTime()) {
      throw new BadRequestException('checkOutAt no puede ser menor a checkInAt');
    }

    const employee = await this.hrRepository.findEmployeeById(employeeId, tenantId);
    if (!employee) {
      throw new BadRequestException('No se puede registrar asistencia sin empleado valido');
    }

    const attendance = await this.hrRepository.createAttendance({
      tenantId,
      employeeId,
      checkInAt,
      checkOutAt,
      status,
      notes,
    });

    return {
      attendance,
      event: 'attendance_registered',
    };
  }
}
