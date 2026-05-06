export type IntegrationTone = 'success' | 'error' | 'info';

/** Resultado de operacion para la region de estado (sin inferir tono por regex en la pagina). */
export interface IntegrationStatus {
  message: string;
  tone: IntegrationTone;
}
