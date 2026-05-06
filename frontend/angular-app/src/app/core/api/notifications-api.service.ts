import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GatewayFetchService } from '../http/gateway-fetch.service';

export type NotificationCallResult = 'ok' | 'http_error' | 'network';

export interface SendEmailRequest {
  to: string;
  subject: string;
  template: string;
  patientName: string;
  appointmentDate: string;
}

export interface SendWhatsappRequest {
  phoneNumber: string;
  message: string;
  eventType: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly auth = inject(AuthService);
  private readonly gateway = inject(GatewayFetchService);

  async sendEmail(body: SendEmailRequest): Promise<NotificationCallResult> {
    return this.callNotification('notifications/email', {
      tenantId: this.auth.tenantId(),
      to: body.to,
      subject: body.subject,
      template: body.template,
      variables: {
        patientName: body.patientName,
        appointmentDate: body.appointmentDate,
      },
    });
  }

  async sendWhatsapp(body: SendWhatsappRequest): Promise<NotificationCallResult> {
    return this.callNotification('notifications/whatsapp', {
      tenantId: this.auth.tenantId(),
      phoneNumber: body.phoneNumber,
      message: body.message,
      eventType: body.eventType,
    });
  }

  private async callNotification(
    path: string,
    body: Record<string, unknown>,
  ): Promise<NotificationCallResult> {
    try {
      const response = await this.gateway.request(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return response.ok ? 'ok' : 'http_error';
    } catch {
      return 'network';
    }
  }
}
