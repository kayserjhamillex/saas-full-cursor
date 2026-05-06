import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { APP_ENVIRONMENT } from '../config/app-environment.token';
import { buildGatewayUrl } from './gateway-url';

export interface GatewayRequestOptions {
  /** Por defecto envía Authorization y x-tenant-id. Desactivar para login / rutas publicas. */
  withAuth?: boolean;
}

/**
 * Acceso al gateway con URL centralizada, cabeceras de auth, manejo de 401 (cierre de sesion)
 * y trazas minimas (dev) / errores (prod).
 */
@Injectable({ providedIn: 'root' })
export class GatewayFetchService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * `path` relativo al gateway, p. ej. `notifications/email` o `auth/login`.
   */
  async request(
    path: string,
    init: RequestInit,
    options: GatewayRequestOptions = {},
  ): Promise<Response> {
    const { withAuth = true } = options;
    const url = buildGatewayUrl(this.env.gatewayBaseUrl, path);
    const headers = new Headers(init.headers);
    if (init.body != null && typeof init.body === 'string' && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    if (withAuth) {
      const token = this.auth.token();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      const tenant = this.auth.tenantId();
      if (tenant) {
        headers.set('x-tenant-id', tenant);
      }
    }
    if (!this.env.production) {
      console.debug(`[gateway] ${init.method ?? 'GET'} ${url}`);
    }
    let response: Response;
    try {
      response = await fetch(url, { ...init, headers });
    } catch (e) {
      if (!this.env.production) {
        console.error('[gateway] error de red', e);
      } else {
        console.error('[gateway] error de red', url, e);
      }
      throw e;
    }
    if (withAuth && response.status === 401) {
      this.auth.logout(this.router);
    }
    if (!this.env.production) {
      console.debug(`[gateway] <= ${response.status} ${url}`);
    } else if (!response.ok) {
      console.error(`[gateway] respuesta no ok ${response.status} ${url}`);
    }
    return response;
  }
}
