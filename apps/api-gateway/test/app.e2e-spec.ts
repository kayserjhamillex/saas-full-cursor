import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { GatewayExceptionFilter } from '../src/shared/filters/gateway-exception.filter';
import { GatewayResponseInterceptor } from '../src/shared/interceptors/gateway-response.interceptor';

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
    app.useGlobalFilters(new GatewayExceptionFilter('api-gateway'));
    app.useGlobalInterceptors(new GatewayResponseInterceptor('api-gateway'));
    app.setGlobalPrefix('gateway');
    await app.init();
  });

  it('rechaza login sin email con formato de error unificado', () => {
    return request(app.getHttpServer())
      .post('/gateway/auth/login')
      .send({
        password: 'secret',
        tenantId: 'tenant-1',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('api-gateway');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('email es obligatorio');
      });
  });

  it('rechaza tenant status sin Authorization con formato unificado', () => {
    return request(app.getHttpServer())
      .get('/gateway/core/tenants/tenant-1/status')
      .set('x-tenant-id', 'tenant-1')
      .expect(401)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('api-gateway');
        expect(response.body.error.httpStatus).toBe(401);
        expect(response.body.error.message).toBe(
          'Authorization header es obligatorio',
        );
      });
  });

  it('rechaza consulta de stock sin tenantId', () => {
    return request(app.getHttpServer())
      .get('/gateway/inventory/stock/product-1')
      .set('authorization', 'Bearer fake-token')
      .set('x-tenant-id', 'tenant-1')
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('api-gateway');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('tenantId es obligatorio');
      });
  });

  it('rechaza create transaction con amount <= 0', () => {
    return request(app.getHttpServer())
      .post('/gateway/financial/transactions')
      .set('authorization', 'Bearer fake-token')
      .set('x-tenant-id', 'tenant-1')
      .send({
        tenantId: 'tenant-1',
        accountId: 'account-1',
        amount: 0,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('amount debe ser mayor a 0');
      });
  });

  it('rechaza stock entry con quantity <= 0', () => {
    return request(app.getHttpServer())
      .post('/gateway/inventory/stock/entries')
      .set('authorization', 'Bearer fake-token')
      .set('x-tenant-id', 'tenant-1')
      .send({
        tenantId: 'tenant-1',
        productId: 'product-1',
        warehouseId: 'warehouse-1',
        quantity: -3,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('quantity debe ser mayor a 0');
      });
  });

  it('rechaza create evaluation con score <= 0', () => {
    return request(app.getHttpServer())
      .post('/gateway/hr/evaluations')
      .set('authorization', 'Bearer fake-token')
      .set('x-tenant-id', 'tenant-1')
      .send({
        tenantId: 'tenant-1',
        employeeId: 'employee-1',
        score: 0,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('score debe ser mayor a 0');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
