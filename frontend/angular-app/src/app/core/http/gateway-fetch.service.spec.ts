import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { APP_ENVIRONMENT } from '../config/app-environment.token';
import { GatewayFetchService } from './gateway-fetch.service';

describe('GatewayFetchService', () => {
  const env = { production: false, gatewayBaseUrl: 'http://localhost:3000/gateway' };
  let service: GatewayFetchService;
  let fetchMock: ReturnType<typeof vi.fn>;
  let authMock: {
    token: ReturnType<typeof vi.fn>;
    tenantId: ReturnType<typeof vi.fn>;
    logout: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    authMock = {
      token: vi.fn().mockReturnValue('token-123'),
      tenantId: vi.fn().mockReturnValue('tenant-abc'),
      logout: vi.fn(),
    };

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        GatewayFetchService,
        provideRouter([]),
        { provide: APP_ENVIRONMENT, useValue: env },
        { provide: AuthService, useValue: authMock },
      ],
    });

    service = TestBed.inject(GatewayFetchService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('GIVEN body string THEN agrega content-type y headers auth', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 } as Response);

    await service.request('notifications/email', { method: 'POST', body: '{"a":1}' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:3000/gateway/notifications/email');
    const headers = new Headers(init.headers);
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer token-123');
    expect(headers.get('x-tenant-id')).toBe('tenant-abc');
  });

  it('GIVEN withAuth false THEN no agrega headers de autenticacion', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 } as Response);

    await service.request('auth/login', { method: 'POST', body: '{}' }, { withAuth: false });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(init.headers);
    expect(headers.get('Authorization')).toBeNull();
    expect(headers.get('x-tenant-id')).toBeNull();
  });

  it('GIVEN 401 con auth THEN ejecuta logout con router', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401 } as Response);

    await service.request('files/upload', { method: 'POST', body: '{}' });

    expect(authMock.logout).toHaveBeenCalledWith(router);
  });

  it('GIVEN error de red THEN relanza excepcion', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    await expect(service.request('files/upload', { method: 'POST', body: '{}' })).rejects.toThrow(
      'network down',
    );
  });
});
