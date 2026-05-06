import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ServiceExceptionFilter } from '../src/shared/filters/service-exception.filter';

type ErrorEnvelopeResponse = {
  body: {
    success: boolean;
    service: string;
    error: {
      httpStatus: number;
      message: string;
    };
  };
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ServiceExceptionFilter('scheduling-service'));
    app.setGlobalPrefix('scheduling');
    await app.init();
  });

  it('crea cita valida', () => {
    return request(app.getHttpServer())
      .post('/scheduling/appointments')
      .send({
        tenantId: 'tenant-1',
        patientId: 'patient-1',
        professionalId: 'professional-1',
        scheduledAt: '2026-04-23T10:00:00.000Z',
        durationMinutes: 30,
      })
      .expect(201)
      .expect((response: { body: { id: string; status: string } }) => {
        expect(response.body.id).toBeDefined();
        expect(response.body.status).toBe('scheduled');
      });
  });

  it('rechaza creacion sin tenantId', () => {
    return request(app.getHttpServer())
      .post('/scheduling/appointments')
      .send({
        patientId: 'patient-1',
        professionalId: 'professional-1',
        scheduledAt: '2026-04-23T10:00:00.000Z',
        durationMinutes: 30,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('scheduling-service');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('tenantId es obligatorio');
      });
  });

  it('rechaza creacion con scheduledAt invalido', () => {
    return request(app.getHttpServer())
      .post('/scheduling/appointments')
      .send({
        tenantId: 'tenant-1',
        patientId: 'patient-1',
        professionalId: 'professional-1',
        scheduledAt: 'fecha-invalida',
        durationMinutes: 30,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('scheduledAt invalido');
      });
  });

  it('rechaza get appointment sin tenantId', () => {
    return request(app.getHttpServer())
      .get('/scheduling/appointments/apt-1')
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('tenantId es obligatorio');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
