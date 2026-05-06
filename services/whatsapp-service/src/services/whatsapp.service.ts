import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class WhatsappService {
  sendMessage(payload: {
    tenantId?: string;
    phoneNumber?: string;
    message?: string;
    eventType?: string;
  }) {
    if (!payload.tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!payload.phoneNumber || !/^\+?[1-9]\d{7,14}$/.test(payload.phoneNumber)) {
      throw new BadRequestException('Numero de telefono invalido');
    }
    if (!payload.message) {
      throw new BadRequestException('message es obligatorio');
    }

    return {
      id: randomUUID(),
      event: 'message_sent',
      status: 'queued',
      tenantId: payload.tenantId,
      phoneNumber: payload.phoneNumber,
      provider: 'whatsapp_mock',
      eventType: payload.eventType ?? 'notification_requested',
      message: payload.message,
      sentAt: new Date().toISOString(),
    };
  }
}
