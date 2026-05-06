import { BadRequestException } from '@nestjs/common';

export class GatewaySendEmailNotificationDto {
  constructor(
    public readonly tenantId: string,
    public readonly to: string,
    public readonly subject: string,
  ) {}

  static from(payload: { tenantId?: string; to?: string; subject?: string }) {
    const tenantId = payload.tenantId?.trim();
    const to = payload.to?.trim();
    const subject = payload.subject?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!to) {
      throw new BadRequestException('to es obligatorio');
    }
    if (!subject) {
      throw new BadRequestException('subject es obligatorio');
    }
    return new GatewaySendEmailNotificationDto(tenantId, to, subject);
  }
}
