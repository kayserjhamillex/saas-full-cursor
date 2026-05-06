import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../../services/auth.service';
import { GatewayFetchService } from '../http/gateway-fetch.service';
import { NotificationsApiService } from './notifications-api.service';

describe('NotificationsApiService', () => {
  let service: NotificationsApiService;
  let gatewayRequest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gatewayRequest = vi.fn();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        NotificationsApiService,
        { provide: GatewayFetchService, useValue: { request: gatewayRequest } },
        { provide: AuthService, useValue: { tenantId: () => 'tenant-01' } },
      ],
    });

    service = TestBed.inject(NotificationsApiService);
  });

  it('GIVEN sendEmail ok THEN retorna ok y payload esperado', async () => {
    gatewayRequest.mockResolvedValue({ ok: true } as Response);

    const result = await service.sendEmail({
      to: 'a@b.com',
      subject: 'cita',
      template: 'appointment_reminder',
      patientName: 'Ana',
      appointmentDate: '2026-01-01',
    });

    expect(result).toBe('ok');
    const [path, init] = gatewayRequest.mock.calls[0] as [string, RequestInit];
    expect(path).toBe('notifications/email');
    const body = JSON.parse(String(init.body)) as {
      tenantId: string;
      to: string;
      variables: { patientName: string; appointmentDate: string };
    };
    expect(body.tenantId).toBe('tenant-01');
    expect(body.to).toBe('a@b.com');
    expect(body.variables.patientName).toBe('Ana');
  });

  it('GIVEN sendWhatsapp http error THEN retorna http_error', async () => {
    gatewayRequest.mockResolvedValue({ ok: false } as Response);

    const result = await service.sendWhatsapp({
      phoneNumber: '+34123456',
      message: 'hola',
      eventType: 'test',
    });

    expect(result).toBe('http_error');
  });

  it('GIVEN error de red THEN retorna network', async () => {
    gatewayRequest.mockRejectedValue(new Error('network'));

    const result = await service.sendEmail({
      to: 'a@b.com',
      subject: 'cita',
      template: 'appointment_reminder',
      patientName: 'Ana',
      appointmentDate: '2026-01-01',
    });

    expect(result).toBe('network');
  });
});
