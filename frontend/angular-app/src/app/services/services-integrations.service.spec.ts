import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FilesApiService } from '../core/api/files-api.service';
import { NotificationsApiService } from '../core/api/notifications-api.service';
import { INTEGRATION_MESSAGES, ServicesIntegrationsService } from './services-integrations.service';

describe('ServicesIntegrationsService', () => {
  let sendEmail: ReturnType<typeof vi.fn>;
  let sendWhatsapp: ReturnType<typeof vi.fn>;
  let upload: ReturnType<typeof vi.fn>;
  let getFileMetadata: ReturnType<typeof vi.fn>;
  let service: ServicesIntegrationsService;

  beforeEach(() => {
    sendEmail = vi.fn();
    sendWhatsapp = vi.fn();
    upload = vi.fn();
    getFileMetadata = vi.fn();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ServicesIntegrationsService,
        { provide: NotificationsApiService, useValue: { sendEmail, sendWhatsapp } },
        { provide: FilesApiService, useValue: { upload, getFileMetadata } },
      ],
    });
    service = TestBed.inject(ServicesIntegrationsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('sendEmail / sendWhatsapp', () => {
    it('GIVEN sendEmail ok THEN mensaje de exito', async () => {
      sendEmail.mockResolvedValue('ok');
      const msg = await service.sendEmail({
        to: 'a@b.com',
        subject: 's',
        template: 't',
        patientName: '',
        appointmentDate: '',
      });
      expect(msg).toBe('Correo enviado correctamente.');
    });

    it('GIVEN sendEmail fallo THEN mensaje de error (edge case)', async () => {
      sendEmail.mockResolvedValue('http_error');
      const msg = await service.sendEmail({
        to: 'a@b.com',
        subject: 's',
        template: 't',
        patientName: '',
        appointmentDate: '',
      });
      expect(msg).toBe('No se pudo enviar correo.');
    });

    it('GIVEN sendEmail red THEN mensaje de red (edge case)', async () => {
      sendEmail.mockResolvedValue('network');
      const msg = await service.sendEmail({
        to: 'a@b.com',
        subject: 's',
        template: 't',
        patientName: '',
        appointmentDate: '',
      });
      expect(msg).toBe(INTEGRATION_MESSAGES.networkError);
    });

    it('GIVEN sendWhatsapp fallo THEN mensaje de error', async () => {
      sendWhatsapp.mockResolvedValue('http_error');
      const msg = await service.sendWhatsapp({ phoneNumber: 'x', message: 'b', eventType: 'e' });
      expect(msg).toBe('No se pudo enviar WhatsApp.');
    });
  });

  describe('Observables ($)', () => {
    it('GIVEN sendEmail$ THEN emite el mismo string que sendEmail', async () => {
      sendEmail.mockResolvedValue('ok');
      const out = await firstValueFrom(
        service.sendEmail$({
          to: 'a@b.com',
          subject: 's',
          template: 't',
          patientName: '',
          appointmentDate: '',
        }),
      );
      expect(out).toBe('Correo enviado correctamente.');
    });
  });

  describe('uploadFileOrMessage / upload', () => {
    const form = { patientId: 'p1', encounterId: 'e1', sourceModule: 'mod' };
    const local = {
      fileName: 'f.txt',
      mimeType: 'text/plain',
      fileBase64: 'YQ==',
    };

    it('GIVEN sin archivo (null) THEN no llama upload y mensaje fijo (edge case)', async () => {
      const r = await service.uploadFileOrMessage(form, null);
      expect(r).toEqual({ message: 'Selecciona un archivo.' });
      expect(upload).not.toHaveBeenCalled();
    });

    it('GIVEN upload http error THEN mensaje de error', async () => {
      upload.mockResolvedValue({ kind: 'http_error' });
      const r = await service.uploadFileOrMessage(form, local);
      expect(r.message).toBe('No se pudo subir archivo.');
    });

    it('GIVEN upload red THEN mensaje de red (edge case)', async () => {
      upload.mockResolvedValue({ kind: 'network' });
      const r = await service.uploadFileOrMessage(form, local);
      expect(r.message).toBe(INTEGRATION_MESSAGES.networkError);
    });

    it('GIVEN upload con id THEN incluye fileId y mensaje', async () => {
      upload.mockResolvedValue({ kind: 'ok', id: 'FILE-1' });
      const r = await service.uploadFileOrMessage(form, local);
      expect(r.fileId).toBe('FILE-1');
      expect(r.message).toContain('FILE-1');
    });

    it('GIVEN upload sin id (edge) THEN mensaje con sin id', async () => {
      upload.mockResolvedValue({ kind: 'ok' });
      const r = await service.uploadFileOrMessage(form, local);
      expect(r.message).toContain('sin id');
      expect(r.fileId).toBeUndefined();
    });
  });

  describe('resolveFileMetadata', () => {
    it('GIVEN getFileMetadata ok THEN data y mensaje ok', async () => {
      getFileMetadata.mockResolvedValue({ kind: 'ok', data: { name: 'x' } });
      const r = await service.resolveFileMetadata('  id-1  ');
      expect(r.data).toEqual({ name: 'x' });
      expect(r.message).toBe('Metadata consultada correctamente.');
    });

    it('GIVEN getFileMetadata http error THEN data null (edge: 404)', async () => {
      getFileMetadata.mockResolvedValue({ kind: 'http_error' });
      const r = await service.resolveFileMetadata('missing');
      expect(r.data).toBeNull();
      expect(r.message).toBe('No se pudo consultar metadata del archivo.');
    });

    it('GIVEN getFileMetadata red THEN mensaje de red (edge case)', async () => {
      getFileMetadata.mockResolvedValue({ kind: 'network' });
      const r = await service.resolveFileMetadata('x');
      expect(r.data).toBeNull();
      expect(r.message).toBe(INTEGRATION_MESSAGES.networkError);
    });
  });

  describe('prepareFileFromInput / prepareFileFromInput$', () => {
    function makeChangeEventWithFile(name: string, mime: string): Event {
      const file = new File(['content'], name, { type: mime });
      const input = document.createElement('input');
      const fileList = {
        0: file,
        length: 1,
        item: (i: number) => (i === 0 ? file : null),
      } as unknown as FileList;
      Object.defineProperty(input, 'files', { value: fileList, configurable: true });
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: input, enumerable: true });
      return event;
    }

    it('GIVEN input sin archivos THEN null (edge case)', async () => {
      const input = document.createElement('input');
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: input, enumerable: true });
      const r = await service.prepareFileFromInput(event);
      expect(r).toBeNull();
    });

    it('GIVEN archivo y tipo vacio THEN usa application/octet-stream (edge case)', async () => {
      const event = makeChangeEventWithFile('bin.dat', '');

      const r = await service.prepareFileFromInput(event);

      expect(r?.mimeType).toBe('application/octet-stream');
      expect(r?.fileName).toBe('bin.dat');
      expect(r?.fileBase64).toBeTruthy();
    });

    it('GIVEN prepareFileFromInput$ con input vacio THEN emite null (Observable)', async () => {
      const input = document.createElement('input');
      const event = new Event('change');
      Object.defineProperty(event, 'target', { value: input, enumerable: true });
      const r = await firstValueFrom(service.prepareFileFromInput$(event));
      expect(r).toBeNull();
    });
  });

  describe('uploadFileOrMessage$ (Observable)', () => {
    it('GIVEN emite mismo resultado que promesa', async () => {
      upload.mockResolvedValue({ kind: 'ok', id: 'x' });
      const r = await firstValueFrom(
        service.uploadFileOrMessage$(
          { patientId: 'p', encounterId: 'e', sourceModule: 'm' },
          { fileName: 'a', mimeType: 'text/plain', fileBase64: 'YQ==' },
        ),
      );
      expect(r.fileId).toBe('x');
    });
  });
});
