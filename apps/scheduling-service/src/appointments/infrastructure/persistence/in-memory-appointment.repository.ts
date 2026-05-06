import { Injectable } from '@nestjs/common';
import type { Appointment } from '../../domain/appointment.entity';
import type { AppointmentRepository } from '../../domain/repositories/appointment.repository';

@Injectable()
export class InMemoryAppointmentRepository implements AppointmentRepository {
  private readonly store = new Map<string, Appointment>();

  save(appointment: Appointment): void {
    this.store.set(appointment.id, appointment);
  }

  findById(appointmentId: string): Appointment | null {
    return this.store.get(appointmentId) ?? null;
  }
}
