import type { IntegrationStatus, IntegrationTone } from './integration-status.model';
import {
  INTEGRATION_MESSAGES,
  fileUploadMessageTone,
} from '../../services/services-integrations.service';

export const integrationClear: IntegrationStatus = { message: '', tone: 'info' };

export function errStatus(message: string): IntegrationStatus {
  return { message, tone: 'error' };
}

export function successStatus(message: string): IntegrationStatus {
  return { message, tone: 'success' };
}

export function infoStatus(message: string): IntegrationStatus {
  return { message, tone: 'info' };
}

export function fromEmailWhatsappServiceMessage(serviceMessage: string): IntegrationStatus {
  if (serviceMessage === INTEGRATION_MESSAGES.networkError) {
    return { message: serviceMessage, tone: 'error' };
  }
  if (
    serviceMessage === INTEGRATION_MESSAGES.emailOk ||
    serviceMessage === INTEGRATION_MESSAGES.whatsappOk
  ) {
    return { message: serviceMessage, tone: 'success' };
  }
  if (
    serviceMessage === INTEGRATION_MESSAGES.emailFail ||
    serviceMessage === INTEGRATION_MESSAGES.whatsappFail
  ) {
    return { message: serviceMessage, tone: 'error' };
  }
  return { message: serviceMessage, tone: 'info' };
}

export function fromFileUploadResult(message: string): IntegrationStatus {
  const tone = fileUploadMessageTone(message);
  return { message, tone: tone as IntegrationTone };
}

export function fromFileMetadata(serviceMessage: string): IntegrationStatus {
  if (serviceMessage === INTEGRATION_MESSAGES.networkError) {
    return { message: serviceMessage, tone: 'error' };
  }
  if (serviceMessage === INTEGRATION_MESSAGES.metadataOk) {
    return { message: serviceMessage, tone: 'success' };
  }
  if (serviceMessage === INTEGRATION_MESSAGES.metadataFail) {
    return { message: serviceMessage, tone: 'error' };
  }
  return { message: serviceMessage, tone: 'info' };
}
