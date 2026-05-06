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
    process.env.JWT_SECRET = 'test-secret';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ServiceExceptionFilter('auth-service'));
    app.setGlobalPrefix('auth');
    await app.init();
  });

  it('GIVEN login sin email WHEN POST /auth/login THEN responde 400', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        password: 'secret',
        tenantId: 'tenant-1',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe('auth-service');
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('email es obligatorio');
      });
  });

  it('GIVEN email invalido WHEN POST /auth/login THEN responde 400', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'correo-invalido',
        password: 'secret',
        tenantId: 'tenant-1',
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe('email invalido');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
