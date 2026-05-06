import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { GatewayFetchService } from '../http/gateway-fetch.service';
import { FilesApiService } from './files-api.service';

describe('FilesApiService', () => {
  let service: FilesApiService;
  let gatewayRequest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gatewayRequest = vi.fn();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        FilesApiService,
        { provide: GatewayFetchService, useValue: { request: gatewayRequest } },
        { provide: AuthService, useValue: { tenantId: () => 'tenant-x' } },
      ],
    });

    service = TestBed.inject(FilesApiService);
  });

  it('GIVEN upload ok THEN retorna kind ok con id', async () => {
    gatewayRequest.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'FILE-1' }),
    } as Response);

    const result = await service.upload({
      patientId: 'p1',
      encounterId: 'e1',
      sourceModule: 'services',
      fileName: 'x.pdf',
      mimeType: 'application/pdf',
      fileBase64: 'abc',
    });

    expect(result).toEqual({ kind: 'ok', id: 'FILE-1' });
    const [path, init] = gatewayRequest.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('files/upload');
    const body = JSON.parse(String(init.body)) as { tenantId: string; fileName: string };
    expect(body.tenantId).toBe('tenant-x');
    expect(body.fileName).toBe('x.pdf');
  });

  it('GIVEN upload http error THEN retorna kind http_error', async () => {
    gatewayRequest.mockResolvedValue({ ok: false } as Response);

    const result = await service.upload({
      patientId: 'p1',
      encounterId: 'e1',
      sourceModule: 'services',
      fileName: 'x.pdf',
      mimeType: 'application/pdf',
      fileBase64: 'abc',
    });

    expect(result).toEqual({ kind: 'http_error' });
  });

  it('GIVEN upload error de red THEN retorna kind network', async () => {
    gatewayRequest.mockRejectedValue(new Error('network'));

    const result = await service.upload({
      patientId: 'p1',
      encounterId: 'e1',
      sourceModule: 'services',
      fileName: 'x.pdf',
      mimeType: 'application/pdf',
      fileBase64: 'abc',
    });

    expect(result).toEqual({ kind: 'network' });
  });

  it('GIVEN getFileMetadata ok THEN retorna data', async () => {
    gatewayRequest.mockResolvedValue({
      ok: true,
      json: async () => ({ name: 'doc.pdf' }),
    } as Response);

    const result = await service.getFileMetadata('ID 123');

    expect(result).toEqual({ kind: 'ok', data: { name: 'doc.pdf' } });
    const [path] = gatewayRequest.mock.calls[0] as [string, RequestInit];
    expect(path).toContain('files/ID%20123');
    expect(path).toContain('tenantId=tenant-x');
  });

  it('GIVEN getFileMetadata not ok THEN retorna http_error', async () => {
    gatewayRequest.mockResolvedValue({ ok: false } as Response);

    const result = await service.getFileMetadata('ID');

    expect(result).toEqual({ kind: 'http_error' });
  });

  it('GIVEN getFileMetadata red THEN retorna network', async () => {
    gatewayRequest.mockRejectedValue(new Error('network'));

    const result = await service.getFileMetadata('ID');

    expect(result).toEqual({ kind: 'network' });
  });
});
