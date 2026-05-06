import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GatewayFetchService } from '../http/gateway-fetch.service';

export interface FileUploadBody {
  patientId: string;
  encounterId: string;
  sourceModule: string;
  fileName: string;
  mimeType: string;
  fileBase64: string;
}

export type FileUploadApiResult =
  | { kind: 'ok'; id?: string }
  | { kind: 'http_error' }
  | { kind: 'network' };

export type FileMetadataApiResult =
  | { kind: 'ok'; data: unknown }
  | { kind: 'http_error' }
  | { kind: 'network' };

@Injectable({ providedIn: 'root' })
export class FilesApiService {
  private readonly auth = inject(AuthService);
  private readonly gateway = inject(GatewayFetchService);

  async upload(body: FileUploadBody): Promise<FileUploadApiResult> {
    try {
      const response = await this.gateway.request('files/upload', {
        method: 'POST',
        body: JSON.stringify({
          tenantId: this.auth.tenantId(),
          patientId: body.patientId,
          encounterId: body.encounterId,
          sourceModule: body.sourceModule,
          fileName: body.fileName,
          mimeType: body.mimeType,
          fileBase64: body.fileBase64,
        }),
      });

      if (!response.ok) {
        return { kind: 'http_error' };
      }
      const data = (await response.json()) as { id?: string };
      return { kind: 'ok', id: data.id };
    } catch {
      return { kind: 'network' };
    }
  }

  async getFileMetadata(fileId: string): Promise<FileMetadataApiResult> {
    try {
      const path = `files/${encodeURIComponent(fileId)}?tenantId=${encodeURIComponent(
        this.auth.tenantId(),
      )}`;
      const response = await this.gateway.request(path, { method: 'GET' });

      if (!response.ok) {
        return { kind: 'http_error' };
      }
      const data = await response.json();
      return { kind: 'ok', data };
    } catch {
      return { kind: 'network' };
    }
  }
}
