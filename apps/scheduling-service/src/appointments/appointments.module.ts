import { Module } from '@nestjs/common';
import { AppointmentsService } from './application/appointments.service';
import { APPOINTMENT_REPOSITORY } from './domain/repositories/appointment.repository';
import { InMemoryAppointmentRepository } from './infrastructure/persistence/in-memory-appointment.repository';
import { AppointmentsController } from './presentation/appointments.controller';

@Module({
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: InMemoryAppointmentRepository,
    },
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
