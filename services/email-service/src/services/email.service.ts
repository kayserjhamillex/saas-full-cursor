import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NotificationQueueService } from './notification-queue.service';
import { TemplateService } from './template.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly templateService: TemplateService,
    private readonly notificationQueueService: NotificationQueueService,
  ) {}

  sendEmail(payload: {
    tenantId?: string;
    to?: string;
    subject?: string;
    template?: string;
    variables?: Record<string, unknown>;
  }) {
    if (!payload.tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!payload.to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.to)) {
      throw new BadRequestException('Correo de destino invalido');
    }
    if (!payload.subject) {
      throw new BadRequestException('subject es obligatorio');
    }

    const compiledTemplate = this.templateService.compile(
      payload.template,
      payload.variables,
    );
    const emailContent = compiledTemplate.renderedBody;
    const eventId = randomUUID();
    this.notificationQueueService.enqueue({
      id: eventId,
      payload: {
        tenantId: payload.tenantId,
        to: payload.to,
        subject: payload.subject,
        content: emailContent,
      },
    });

    return {
      id: eventId,
      event: 'email_sent',
      status: 'queued',
      tenantId: payload.tenantId,
      to: payload.to,
      subject: payload.subject,
      content: emailContent,
      templateData: compiledTemplate,
      provider: 'smtp_mock',
      sentAt: new Date().toISOString(),
    };
  }
}
