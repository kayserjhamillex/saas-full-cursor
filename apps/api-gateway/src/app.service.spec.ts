import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppService } from './app.service';

describe('AppService communication', () => {
  const verifyAsyncMock = jest.fn();
  const jwtService = {
    verifyAsync: verifyAsyncMock,
  } as unknown as JwtService;

  let service: AppService;
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CLINICAL_SERVICE_URL = 'http://clinical-service';
    process.env.INVENTORY_SERVICE_URL = 'http://inventory-service';
    service = new AppService(jwtService);
    (global as { fetch: typeof fetch }).fetch = fetchMock;
    jest.spyOn(service as any, 'validateAndForwardTenant').mockResolvedValue({
      tenantId: 'tenant-1',
    });
  });

  afterAll(() => {
    (global as { fetch: typeof fetch }).fetch = originalFetch;
  });

  it('GIVEN request valida WHEN forwardClinicalRequest THEN llama upstream con contrato esperado', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ patientId: 'p-1' }),
    });

    const result = await service.forwardClinicalRequest({
      tenantId: 'tenant-1',
      authorization: 'Bearer token',
      requestTenantId: 'tenant-1',
      path: 'patients',
      method: 'GET',
      query: { tenantId: 'tenant-1', filter: 'recent' },
    });

    const firstCall = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(firstCall[0]).toBe(
      'http://clinical-service/clinical/patients?tenantId=tenant-1&filter=recent',
    );
    expect(firstCall[1].method).toBe('GET');
    expect(firstCall[1].headers).toEqual(
      expect.objectContaining({
        authorization: 'Bearer token',
        'x-tenant-id': 'tenant-1',
      }),
    );
    expect(result).toEqual({ patientId: 'p-1' });
  });

  it('GIVEN error nested en upstream WHEN forwardClinicalRequest THEN propaga mensaje funcional', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Tenant bloqueado' } }),
    });

    await expect(
      service.forwardClinicalRequest({
        tenantId: 'tenant-1',
        authorization: 'Bearer token',
        requestTenantId: 'tenant-1',
        path: 'patients',
        method: 'POST',
        body: { name: 'Ana' },
      }),
    ).rejects.toThrow('Tenant bloqueado');
  });

  it('GIVEN requestTenantId vacio WHEN forwardClinicalRequest THEN rechaza por contrato', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await expect(
      service.forwardClinicalRequest({
        tenantId: 'tenant-1',
        authorization: 'Bearer token',
        requestTenantId: '',
        path: 'patients',
        method: 'GET',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('GIVEN request inventario WHEN forwardInventoryRequest THEN mantiene contrato de comunicacion', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ total: 1, items: [] }),
    });

    const result = await service.forwardInventoryRequest({
      tenantId: 'tenant-1',
      authorization: 'Bearer token',
      requestTenantId: 'tenant-1',
      path: 'stock/product-1',
      method: 'GET',
      query: { tenantId: 'tenant-1', warehouseId: 'wh-1' },
    });

    const firstCall = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(firstCall[0]).toBe(
      'http://inventory-service/inventory/stock/product-1?tenantId=tenant-1&warehouseId=wh-1',
    );
    expect(firstCall[1].headers).toEqual(
      expect.objectContaining({
        authorization: 'Bearer token',
        'x-tenant-id': 'tenant-1',
      }),
    );
    expect(result).toEqual({ total: 1, items: [] });
  });
});

describe('AppService tenant communication contract', () => {
  const verifyAsyncMock = jest.fn();
  const jwtService = {
    verifyAsync: verifyAsyncMock,
  } as unknown as JwtService;
  const fetchMock = jest.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CORE_SERVICE_URL = 'http://core-service';
    process.env.INTERNAL_SERVICE_TOKEN = 'internal-token';
    process.env.ENABLE_TENANT_CACHE = 'true';
    (global as { fetch: typeof fetch }).fetch = fetchMock;
    verifyAsyncMock.mockResolvedValue({
      sub: 'u1',
      email: 'u1@test.com',
      tenantId: 'tenant-1',
      iat: 1,
      exp: 2,
    });
  });

  afterAll(() => {
    (global as { fetch: typeof fetch }).fetch = originalFetch;
  });

  it('GIVEN same tenant request twice WHEN validateAndForwardTenant THEN usa cache y evita segundo fetch', async () => {
    const service = new AppService(jwtService);
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ valid: true }),
    });

    const first = await service.validateAndForwardTenant(
      'tenant-1',
      'Bearer token',
      'tenant-1',
      'clinical',
    );
    const second = await service.validateAndForwardTenant(
      'tenant-1',
      'Bearer token',
      'tenant-1',
      'clinical',
    );

    expect(first).toEqual({ valid: true });
    expect(second).toEqual({ valid: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('GIVEN token tenant distinto WHEN validateAndForwardTenant THEN rechaza por contrato', async () => {
    const service = new AppService(jwtService);
    verifyAsyncMock.mockResolvedValue({
      sub: 'u1',
      email: 'u1@test.com',
      tenantId: 'another-tenant',
      iat: 1,
      exp: 2,
    });

    await expect(
      service.validateAndForwardTenant(
        'tenant-1',
        'Bearer token',
        'tenant-1',
        'clinical',
      ),
    ).rejects.toThrow('Tenant no coincide con el token');
  });
});
