import { Injectable, inject } from '@angular/core';
import { Observable, defer, from } from 'rxjs';
import { FilesApiService, FileUploadBody } from '../core/api/files-api.service';
import {
  NotificationsApiService,
  type SendEmailRequest,
  type SendWhatsappRequest,
} from '../core/api/notifications-api.service';
import { readFileAsBase64 } from '../shared/utils/file-to-base64';

/** Textos de respuesta estables para mapear tono en UI sin regex en la pagina. */
export const INTEGRATION_MESSAGES = {
  emailOk: 'Correo enviado correctamente.',
  emailFail: 'No se pudo enviar correo.',
  whatsappOk: 'WhatsApp enviado correctamente.',
  whatsappFail: 'No se pudo enviar WhatsApp.',
  networkError: 'Error de conexion. Comprueba tu red o vuelve a intentar en unos minutos.',
  metadataOk: 'Metadata consultada correctamente.',
  metadataFail: 'No se pudo consultar metadata del archivo.',
  filePickRequired: 'Selecciona un archivo.',
  fileUploadFail: 'No se pudo subir archivo.',
} as const;

/** Tono de UI para mensajes de subida (respuesta con `sin id` se muestra como informativo). */
export function fileUploadMessageTone(message: string): 'success' | 'error' | 'info' {
  if (
    message === INTEGRATION_MESSAGES.networkError ||
    message === INTEGRATION_MESSAGES.filePickRequired ||
    message === INTEGRATION_MESSAGES.fileUploadFail
  ) {
    return 'error';
  }
  if (message.startsWith('Archivo subido') && message.includes('sin id')) {
    return 'info';
  }
  if (message.startsWith('Archivo subido')) {
    return 'success';
  }
  return 'info';
}

/** Datos listos para subir tras leer un archivo local. */
export interface PreparedLocalFile {
  fileName: string;
  mimeType: string;
  fileBase64: string;
}

export interface FileUploadFormFields {
  patientId: string;
  encounterId: string;
  sourceModule: string;
}

export interface FileUploadResult {
  message: string;
  fileId?: string;
}

@Injectable({ providedIn: 'root' })
export class ServicesIntegrationsService {
  private readonly notifications = inject(NotificationsApiService);
  private readonly files = inject(FilesApiService);

  async sendEmail(dto: SendEmailRequest): Promise<string> {
    const r = await this.notifications.sendEmail(dto);
    if (r === 'ok') {
      return INTEGRATION_MESSAGES.emailOk;
    }
    if (r === 'network') {
      return INTEGRATION_MESSAGES.networkError;
    }
    return INTEGRATION_MESSAGES.emailFail;
  }

  async sendWhatsapp(dto: SendWhatsappRequest): Promise<string> {
    const r = await this.notifications.sendWhatsapp(dto);
    if (r === 'ok') {
      return INTEGRATION_MESSAGES.whatsappOk;
    }
    if (r === 'network') {
      return INTEGRATION_MESSAGES.networkError;
    }
    return INTEGRATION_MESSAGES.whatsappFail;
  }

  /**
   * Convierte el `change` de un input file en payload de subida, o null si no hay archivo.
   */
  async prepareFileFromInput(event: Event): Promise<PreparedLocalFile | null> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return null;
    }
    const fileBase64 = await readFileAsBase64(file);
    return {
      fileName: file.name,
      mimeType: this.normalizeMimeType(file.type),
      fileBase64,
    };
  }

  /**
   * Subida con regla de negocio: sin archivo preparado, devuelve mensaje y no llama al API.
   */
  async uploadFileOrMessage(
    form: FileUploadFormFields,
    local: PreparedLocalFile | null,
  ): Promise<FileUploadResult> {
    if (!local) {
      return { message: INTEGRATION_MESSAGES.filePickRequired };
    }
    return this.uploadFile(form, local);
  }

  private async uploadFile(
    form: FileUploadFormFields,
    local: PreparedLocalFile,
  ): Promise<FileUploadResult> {
    const body: FileUploadBody = {
      patientId: form.patientId,
      encounterId: form.encounterId,
      sourceModule: form.sourceModule,
      fileName: local.fileName,
      mimeType: local.mimeType,
      fileBase64: local.fileBase64,
    };

    const data = await this.files.upload(body);
    if (data.kind === 'network') {
      return { message: INTEGRATION_MESSAGES.networkError };
    }
    if (data.kind === 'http_error') {
      return { message: INTEGRATION_MESSAGES.fileUploadFail };
    }

    const fileId = data.id;
    const message = `Archivo subido correctamente. fileId: ${fileId ?? 'sin id'}`;
    return { message, fileId };
  }

  /**
   * Resuelve metadata para mostrar en UI: recorte de `fileId`, mensajes fijos y carga HTTP.
   */
  async resolveFileMetadata(fileId: string): Promise<{ message: string; data: unknown | null }> {
    const id = fileId.trim();
    const result = await this.files.getFileMetadata(id);

    if (result.kind === 'network') {
      return { message: INTEGRATION_MESSAGES.networkError, data: null };
    }
    if (result.kind === 'http_error') {
      return { message: INTEGRATION_MESSAGES.metadataFail, data: null };
    }

    return { message: INTEGRATION_MESSAGES.metadataOk, data: result.data };
  }

  private normalizeMimeType(mime: string): string {
    return mime && mime.length > 0 ? mime : 'application/octet-stream';
  }

  /** Emisión a partir de la misma lógica que `sendEmail` (p. ej. con `async` pipe, sin `subscribe` manual). */
  sendEmail$(dto: SendEmailRequest): Observable<string> {
    return defer(() => from(this.sendEmail(dto)));
  }

  sendWhatsapp$(dto: SendWhatsappRequest): Observable<string> {
    return defer(() => from(this.sendWhatsapp(dto)));
  }

  prepareFileFromInput$(event: Event): Observable<PreparedLocalFile | null> {
    return defer(() => from(this.prepareFileFromInput(event)));
  }

  uploadFileOrMessage$(
    form: FileUploadFormFields,
    local: PreparedLocalFile | null,
  ): Observable<FileUploadResult> {
    return defer(() => from(this.uploadFileOrMessage(form, local)));
  }

  resolveFileMetadata$(fileId: string): Observable<{ message: string; data: unknown | null }> {
    return defer(() => from(this.resolveFileMetadata(fileId)));
  }
}
