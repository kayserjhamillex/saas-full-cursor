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
    app.useGlobalFilters(new ServiceExceptionFilter('financial-service'));
    app.setGlobalPrefix('financial');
    await app.init();
  });

  it('rechaza create account sin tenantId', () => {
    return request(app.getHttpServer())
      .post('/financial/accounts')
      .send({
        name: 'Caja Principal',
        accountType: 'cash',
        currency: 'USD',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('financial-service');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('tenantId es obligatorio');
      });
  });

  it('rechaza create transaction con transactionType invalido', () => {
    return request(app.getHttpServer())
      .post('/financial/transactions')
      .send({
        tenantId: 'tenant-1',
        accountId: 'acc-1',
        transactionType: 'invalid',
        amount: 100,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe(
          'transactionType debe ser income o expense',
        );
      });
  });

  it('rechaza create transaction con amount invalido', () => {
    return request(app.getHttpServer())
      .post('/financial/transactions')
      .send({
        tenantId: 'tenant-1',
        accountId: 'acc-1',
        transactionType: 'income',
        amount: 0,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('amount debe ser mayor a 0');
      });
  });

  it('rechaza cash-flow sin tenantId', () => {
    return request(app.getHttpServer())
      .get('/financial/reports/cash-flow')
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
