import type { Appointment } from '../appointment.entity';

export const APPOINTMENT_REPOSITORY = Symbol('APPOINTMENT_REPOSITORY');

export interface AppointmentRepository {
  save(appointment: Appointment): void;
  findById(appointmentId: string): Appointment | null;
}
