import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { APPOINTMENT_REPOSITORY } from '../domain/repositories/appointment.repository';
import type { AppointmentRepository } from '../domain/repositories/appointment.repository';
import type { Appointment } from '../domain/appointment.entity';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repository: AppointmentRepository;

  beforeEach(async () => {
    const store = new Map<string, Appointment>();
    const mockRepo: AppointmentRepository = {
      save(appointment) {
        store.set(appointment.id, appointment);
      },
      findById(id) {
        return store.get(id) ?? null;
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: APPOINTMENT_REPOSITORY, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    repository = module.get<AppointmentRepository>(APPOINTMENT_REPOSITORY);
  });

  it('crea y persiste cita', () => {
    const created = service.createAppointment({
      tenantId: 't1',
      patientId: 'p1',
      professionalId: 'pr1',
      scheduledAt: '2026-04-23T10:00:00.000Z',
      durationMinutes: 20,
    });

    expect(created.id).toBeDefined();
    expect(created.status).toBe('scheduled');
    expect(repository.findById(created.id)?.tenantId).toBe('t1');
  });

  it('lanza NotFound si el tenant no coincide', () => {
    const created = service.createAppointment({
      tenantId: 't1',
      patientId: 'p1',
      professionalId: 'pr1',
      scheduledAt: '2026-04-23T10:00:00.000Z',
      durationMinutes: 20,
    });

    expect(() => service.getAppointment(created.id, 'otro-tenant')).toThrow(
      NotFoundException,
    );
  });
});
