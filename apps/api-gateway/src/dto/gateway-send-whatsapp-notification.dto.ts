import { BadRequestException } from '@nestjs/common';

export class GatewaySendWhatsappNotificationDto {
  constructor(
    public readonly tenantId: string,
    public readonly phoneNumber: string,
    public readonly message: string,
  ) {}

  static from(payload: {
    tenantId?: string;
    phoneNumber?: string;
    message?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const phoneNumber = payload.phoneNumber?.trim();
    const message = payload.message?.trim();
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!phoneNumber) {
      throw new BadRequestException('phoneNumber es obligatorio');
    }
    if (!message) {
      throw new BadRequestException('message es obligatorio');
    }
    return new GatewaySendWhatsappNotificationDto(
      tenantId,
      phoneNumber,
      message,
    );
  }
}
