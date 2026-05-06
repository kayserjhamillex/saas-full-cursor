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
    app.useGlobalFilters(new ServiceExceptionFilter('hr-service'));
    app.setGlobalPrefix('hr');
    await app.init();
  });

  it('rechaza create employee sin tenantId', () => {
    return request(app.getHttpServer())
      .post('/hr/employees')
      .send({
        fullName: 'Juan Perez',
        documentNumber: '12345678',
        email: 'juan@test.com',
        roleName: 'assistant',
        position: 'frontdesk',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('hr-service');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('tenantId es obligatorio');
      });
  });

  it('rechaza create evaluation con score fuera de rango', () => {
    return request(app.getHttpServer())
      .post('/hr/evaluations')
      .send({
        tenantId: 'tenant-1',
        employeeId: 'employee-1',
        evaluatorName: 'Supervisor',
        score: 120,
        evaluatedAt: '2026-04-23T10:00:00.000Z',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe(
          'score debe estar entre 0 y 100',
        );
      });
  });

  it('rechaza attendance con checkInAt invalido', () => {
    return request(app.getHttpServer())
      .post('/hr/attendance')
      .send({
        tenantId: 'tenant-1',
        employeeId: 'employee-1',
        checkInAt: 'fecha-invalida',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('checkInAt invalido');
      });
  });

  it('rechaza payroll con baseAmount invalido', () => {
    return request(app.getHttpServer())
      .post('/hr/payroll')
      .send({
        tenantId: 'tenant-1',
        employeeId: 'employee-1',
        periodLabel: '2026-04',
        baseAmount: 0,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe(
          'baseAmount debe ser mayor a 0',
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
