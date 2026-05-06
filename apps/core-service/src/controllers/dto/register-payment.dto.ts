import { BadRequestException } from '@nestjs/common';

type PaymentStatus = 'paid' | 'pending' | 'failed';

export class RegisterPaymentDto {
  constructor(
    public readonly tenantId: string,
    public readonly amount: number,
    public readonly status: PaymentStatus,
    public readonly extensionDays: number,
  ) {}

  static from(payload: {
    tenantId?: string;
    amount?: number;
    status?: PaymentStatus;
    extensionDays?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const amount = Number(payload.amount);
    const status = payload.status ?? 'paid';
    const extensionDays = Number(payload.extensionDays ?? 30);

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException('amount debe ser mayor a 0');
    }

    const validStatuses: PaymentStatus[] = ['paid', 'pending', 'failed'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('status invalido');
    }
    if (!Number.isInteger(extensionDays) || extensionDays < 1) {
      throw new BadRequestException('extensionDays debe ser mayor a 0');
    }

    return new RegisterPaymentDto(tenantId, amount, status, extensionDays);
  }
}
