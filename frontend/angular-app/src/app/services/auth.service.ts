import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ENVIRONMENT } from '../core/config/app-environment.token';
import { buildGatewayUrl } from '../core/http/gateway-url';

interface LoginPayload {
  email: string;
  password: string;
  tenantId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly tokenKey = 'admin_access_token';
  private readonly tenantKey = 'admin_tenant_id';
  private readonly authState = signal<boolean>(!!localStorage.getItem(this.tokenKey));

  isAuthenticated() {
    return this.authState();
  }

  tenantId() {
    return localStorage.getItem(this.tenantKey) ?? '';
  }

  token() {
    return localStorage.getItem(this.tokenKey) ?? '';
  }

  async login(payload: LoginPayload) {
    const response = await fetch(this.authUrl('login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Credenciales invalidas o tenant no autorizado');
    }

    const data = await response.json();
    const token = data.accessToken || data.token;
    if (!token) throw new Error('Respuesta de login sin token');

    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tenantKey, payload.tenantId);
    this.authState.set(true);
  }

  async recover(email: string, tenantId: string) {
    return this.callOptionalEndpoint('recover', { email, tenantId });
  }

  async verifyCode(email: string, tenantId: string, code: string) {
    return this.callOptionalEndpoint('verify-code', { email, tenantId, code });
  }

  async updatePassword(email: string, tenantId: string, code: string, newPassword: string) {
    return this.callOptionalEndpoint('update-password', { email, tenantId, code, newPassword });
  }

  logout(router?: Router) {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tenantKey);
    this.authState.set(false);
    if (router) void router.navigateByUrl('/login');
  }

  private authUrl(suffix: string) {
    return buildGatewayUrl(this.env.gatewayBaseUrl, `auth/${suffix}`);
  }

  private async callOptionalEndpoint(path: string, payload: unknown) {
    const response = await fetch(this.authUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Endpoint aun no disponible en backend');
    }

    return response.json();
  }
}
