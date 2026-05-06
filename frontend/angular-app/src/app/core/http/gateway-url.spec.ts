import { describe, expect, it } from 'vitest';
import { buildGatewayUrl } from './gateway-url';

describe('buildGatewayUrl', () => {
  it('GIVEN base absoluta y path THEN URL unida', () => {
    expect(buildGatewayUrl('http://localhost:3000/gateway', 'auth/login')).toBe(
      'http://localhost:3000/gateway/auth/login',
    );
  });

  it('GIVEN base relativa /gateway THEN mantiene ruta (produccion mismo origen)', () => {
    expect(buildGatewayUrl('/gateway', 'notifications/email')).toBe('/gateway/notifications/email');
  });

  it('GIVEN barra final en base THEN no duplica', () => {
    expect(buildGatewayUrl('http://h/gateway/', 'files/upload')).toBe(
      'http://h/gateway/files/upload',
    );
  });
});
