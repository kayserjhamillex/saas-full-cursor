/**
 * Producción: mismo origen bajo `/gateway` (ajustar vía despliegue o sustituir este archivo).
 * URL absoluta alternativa: `https://api.tu-dominio.com/gateway`
 */
export const environment = {
  production: true,
  gatewayBaseUrl: '/gateway',
};

export type AppEnvironment = typeof environment;
