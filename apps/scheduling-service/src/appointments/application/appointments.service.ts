import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Appointment } from '../domain/appointment.entity';
import {
  APPOINTMENT_REPOSITORY,
  type AppointmentRepository,
} from '../domain/repositories/appointment.repository';

export type CreateAppointmentInput = {
  tenantId: string;
  patientId: string;
  professionalId: string;
  scheduledAt: string;
  durationMinutes: number;
};

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  createAppointment(input: CreateAppointmentInput): Appointment {
    const id = randomUUID();
    const appointment: Appointment = {
      id,
      tenantId: input.tenantId,
      patientId: input.patientId,
      professionalId: input.professionalId,
      scheduledAt: input.scheduledAt,
      durationMinutes: input.durationMinutes,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };
    this.appointmentRepository.save(appointment);
    return appointment;
  }

  getAppointment(appointmentId: string, tenantId: string): Appointment {
    const appointment = this.appointmentRepository.findById(appointmentId);
    if (!appointment || appointment.tenantId !== tenantId) {
      throw new NotFoundException('Cita no encontrada');
    }
    return appointment;
  }
}
