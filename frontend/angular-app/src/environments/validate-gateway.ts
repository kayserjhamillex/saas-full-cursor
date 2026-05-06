import type { AppEnvironment } from './environment';

/**
 * Aviso en consola en produccion si el gateway parece mal configurado
 * (no bloquea el arranque; el despliegue debe fijar `fileReplacements` o URL correcta).
 */
export function warnIfGatewayMisconfigured(env: AppEnvironment): void {
  if (typeof globalThis === 'undefined') {
    return;
  }
  const hasWindow = typeof (globalThis as { window?: unknown }).window !== 'undefined';
  if (!hasWindow) {
    return;
  }
  const b = (env.gatewayBaseUrl ?? '').trim();
  if (b === '') {
    console.warn(
      '[config] gatewayBaseUrl esta vacio. Ajusta src/environments/environment.prod.ts o el build.',
    );
  }
  if (env.production && (b.startsWith('http://localhost') || b.startsWith('http://127.0.0.1'))) {
    console.warn(
      '[config] gatewayBaseUrl apunta a localhost en build de produccion. Revisa el despliegue (proxy o URL absoluta).',
    );
  }
}
