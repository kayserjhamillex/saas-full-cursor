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
    app.useGlobalFilters(new ServiceExceptionFilter('inventory-service'));
    app.setGlobalPrefix('inventory');
    await app.init();
  });

  it('rechaza create product sin tenantId', () => {
    return request(app.getHttpServer())
      .post('/inventory/products')
      .send({
        categoryId: 'cat-1',
        sku: 'SKU-001',
        name: 'Insumo',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('inventory-service');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('tenantId es obligatorio');
      });
  });

  it('rechaza stock entry con quantity invalida', () => {
    return request(app.getHttpServer())
      .post('/inventory/stock/entries')
      .send({
        tenantId: 'tenant-1',
        productId: 'prod-1',
        warehouseId: 'wh-1',
        quantity: 0,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('quantity debe ser mayor a 0');
      });
  });

  it('rechaza stock exit sin warehouseId', () => {
    return request(app.getHttpServer())
      .post('/inventory/stock/exits')
      .send({
        tenantId: 'tenant-1',
        productId: 'prod-1',
        quantity: 2,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('warehouseId es obligatorio');
      });
  });

  it('rechaza stock transfer con quantity invalida', () => {
    return request(app.getHttpServer())
      .post('/inventory/stock/transfers')
      .send({
        tenantId: 'tenant-1',
        productId: 'prod-1',
        fromWarehouseId: 'wh-1',
        toWarehouseId: 'wh-2',
        quantity: 0,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('quantity debe ser mayor a 0');
      });
  });

  it('rechaza get stock sin warehouseId', () => {
    return request(app.getHttpServer())
      .get('/inventory/stock/prod-1?tenantId=tenant-1')
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('warehouseId es obligatorio');
      });
  });

  it('rechaza create warehouse sin name', () => {
    return request(app.getHttpServer())
      .post('/inventory/warehouses')
      .send({
        tenantId: 'tenant-1',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('name es obligatorio');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
