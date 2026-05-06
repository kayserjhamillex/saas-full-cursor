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
    app.useGlobalFilters(new ServiceExceptionFilter('clinical-service'));
    app.setGlobalPrefix('clinical');
    await app.init();
  });

  it('rechaza create patient sin tenantId', () => {
    return request(app.getHttpServer())
      .post('/clinical/patients')
      .send({
        name: 'Ana Perez',
        document: '12345678',
        birthDate: '1990-01-01',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('clinical-service');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('tenantId es obligatorio');
      });
  });

  it('rechaza create encounter con encounterDate invalido', () => {
    return request(app.getHttpServer())
      .post('/clinical/records/encounters')
      .send({
        tenantId: 'tenant-1',
        patientId: 'patient-1',
        encounterDate: 'fecha-invalida',
        notes: 'Control inicial',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('encounterDate invalido');
      });
  });

  it('rechaza register diagnosis sin description', () => {
    return request(app.getHttpServer())
      .post('/clinical/records/diagnoses')
      .send({
        tenantId: 'tenant-1',
        patientId: 'patient-1',
        encounterId: 'encounter-1',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('description es obligatorio');
      });
  });

  it('rechaza ai process sin imageBase64', () => {
    return request(app.getHttpServer())
      .post('/clinical/records/ai/process')
      .send({
        tenantId: 'tenant-1',
        patientId: 'patient-1',
        encounterId: 'encounter-1',
        imageName: 'placa-001.png',
        mimeType: 'image/png',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('imageBase64 es obligatorio');
      });
  });

  it('rechaza get timeline sin tenantId', () => {
    return request(app.getHttpServer())
      .get('/clinical/records/timeline/patient-1')
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('tenantId es obligatorio');
      });
  });

  it('rechaza update odontogram sin chartData', () => {
    return request(app.getHttpServer())
      .post('/clinical/odontograms')
      .send({
        tenantId: 'tenant-1',
        patientId: 'patient-1',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('chartData es obligatorio');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
