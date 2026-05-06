export type AppointmentStatus = 'scheduled';

export type Appointment = {
  id: string;
  tenantId: string;
  patientId: string;
  professionalId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  createdAt: string;
};
