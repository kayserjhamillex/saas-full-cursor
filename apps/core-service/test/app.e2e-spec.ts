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
    process.env.INTERNAL_SERVICE_TOKEN = 'test-internal-token';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ServiceExceptionFilter('core-service'));
    app.setGlobalPrefix('core');
    await app.init();
  });

  it('rechaza createTenant sin name', () => {
    return request(app.getHttpServer())
      .post('/core/tenants')
      .send({})
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('core-service');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('name es obligatorio');
      });
  });

  it('rechaza validate tenant con module invalido', () => {
    return request(app.getHttpServer())
      .get('/core/tenants/internal/tenant-1/validate?module=@@@')
      .set('x-internal-service-token', 'test-internal-token')
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('module invalido');
      });
  });

  it('rechaza module status con isActive no booleano', () => {
    return request(app.getHttpServer())
      .patch('/core/modules/status')
      .send({
        tenantId: 'tenant-1',
        moduleName: 'clinical',
        isActive: 'true',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('isActive debe ser booleano');
      });
  });

  it('rechaza create subscription con durationDays invalido', () => {
    return request(app.getHttpServer())
      .post('/core/subscriptions')
      .send({
        tenantId: 'tenant-1',
        plan: 'basic',
        durationDays: 0,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe(
          'durationDays debe ser mayor a 0',
        );
      });
  });

  it('rechaza validate tenant sin token interno', () => {
    return request(app.getHttpServer())
      .get('/core/tenants/internal/tenant-1/validate')
      .expect(401)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(401);
        expect(response.body.error.message).toBe('Token interno invalido');
      });
  });

  it('rechaza register payment con amount invalido', () => {
    return request(app.getHttpServer())
      .post('/core/payments')
      .send({
        tenantId: 'tenant-1',
        amount: 0,
        status: 'paid',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('amount debe ser mayor a 0');
      });
  });

  it('rechaza register payment con status invalido', () => {
    return request(app.getHttpServer())
      .post('/core/payments')
      .send({
        tenantId: 'tenant-1',
        amount: 100,
        status: 'unknown',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('status invalido');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
