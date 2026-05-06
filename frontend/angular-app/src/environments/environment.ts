/** Desarrollo local. En producción se reemplaza por `environment.prod.ts` (fileReplacements). */
export const environment = {
  production: false,
  /** Base del API gateway (sin barra final). Puede ser absoluta o relativa, p. ej. `/gateway` detrás del mismo origen. */
  gatewayBaseUrl: 'http://localhost:3000/gateway',
};

export type AppEnvironment = typeof environment;
