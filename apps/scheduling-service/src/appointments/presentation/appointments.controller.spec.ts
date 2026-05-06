import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from '../application/appointments.service';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  const createAppointmentMock = jest
    .fn()
    .mockReturnValue({ id: 'apt-1', status: 'scheduled' });

  beforeEach(async () => {
    createAppointmentMock.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            createAppointment: createAppointmentMock,
            getAppointment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('delega createAppointment al servicio con datos validados', () => {
    const result = controller.createAppointment({
      tenantId: 't1',
      patientId: 'p1',
      professionalId: 'pr1',
      scheduledAt: '2026-04-23T10:00:00.000Z',
      durationMinutes: 30,
    });

    expect(createAppointmentMock).toHaveBeenCalledWith({
      tenantId: 't1',
      patientId: 'p1',
      professionalId: 'pr1',
      scheduledAt: '2026-04-23T10:00:00.000Z',
      durationMinutes: 30,
    });
    expect(result).toEqual({ id: 'apt-1', status: 'scheduled' });
  });
});
