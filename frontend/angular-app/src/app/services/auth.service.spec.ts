import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_ENVIRONMENT } from '../core/config/app-environment.token';
import { AuthService } from './auth.service';

const testEnv = { production: false, gatewayBaseUrl: 'http://localhost:3000/gateway' as const };

describe('AuthService', () => {
  const tokenKey = 'admin_access_token';
  const tenantKey = 'admin_tenant_id';

  let fetchMock: ReturnType<typeof vi.fn>;
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: APP_ENVIRONMENT, useValue: testEnv }],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('GIVEN localStorage sin token THEN isAuthenticated false', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('GIVEN token en localStorage al instanciar THEN isAuthenticated true (edge: persistencia)', () => {
    localStorage.setItem(tokenKey, 'existing');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: APP_ENVIRONMENT, useValue: testEnv }],
    });
    const s2 = TestBed.inject(AuthService);
    expect(s2.isAuthenticated()).toBe(true);
  });

  it('GIVEN login ok con accessToken THEN guarda token y tenant y auth true', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ accessToken: 't1' }),
    });

    await service.login({ email: 'a@b.com', password: 'p', tenantId: 'T1' });

    expect(localStorage.getItem(tokenKey)).toBe('t1');
    expect(localStorage.getItem(tenantKey)).toBe('T1');
    expect(service.isAuthenticated()).toBe(true);
    expect(service.tenantId()).toBe('T1');
    expect(service.token()).toBe('t1');
  });

  it('GIVEN login ok con campo token (alias) THEN acepta token', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 't2' }),
    });
    await service.login({ email: 'a@b.com', password: 'p', tenantId: 'T2' });
    expect(service.token()).toBe('t2');
  });

  it('GIVEN respuesta no ok THEN lanza', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401, json: () => Promise.resolve({}) });
    await expect(service.login({ email: 'a@b.com', password: 'p', tenantId: 'T' })).rejects.toThrow(
      'Credenciales invalidas o tenant no autorizado',
    );
  });

  it('GIVEN json sin token ni accessToken THEN lanza (edge case)', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    await expect(service.login({ email: 'a@b.com', password: 'p', tenantId: 'T' })).rejects.toThrow(
      'Respuesta de login sin token',
    );
  });

  it('GIVEN recover ok THEN devuelve json', async () => {
    const body = { ok: true };
    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve(body) });
    const result = await service.recover('e@e.com', 'T');
    expect(result).toEqual(body);
  });

  it('GIVEN optional endpoint not ok THEN lanza', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) });
    await expect(service.recover('e@e.com', 'T')).rejects.toThrow(
      'Endpoint aun no disponible en backend',
    );
  });

  it('GIVEN logout THEN limpia y auth false; con Router navega a /login', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve({ accessToken: 't' }) });
    await service.login({ email: 'a@b.com', password: 'p', tenantId: 'T' });
    const navigateByUrl = vi.fn();
    const router = { navigateByUrl } as unknown as Router;

    service.logout(router);

    expect(localStorage.getItem(tokenKey)).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
