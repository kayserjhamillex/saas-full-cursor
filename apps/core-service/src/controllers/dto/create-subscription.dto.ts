import { BadRequestException } from '@nestjs/common';

export class CreateSubscriptionDto {
  constructor(
    public readonly tenantId: string,
    public readonly plan: string,
    public readonly durationDays: number,
  ) {}

  static from(payload: {
    tenantId?: string;
    plan?: string;
    durationDays?: number;
  }) {
    const tenantId = payload.tenantId?.trim();
    const plan = payload.plan?.trim().toLowerCase();
    const durationDays = Number(payload.durationDays ?? 30);

    if (!tenantId || !plan) {
      throw new BadRequestException('tenantId y plan son obligatorios');
    }
    if (!Number.isFinite(durationDays) || durationDays < 1) {
      throw new BadRequestException('durationDays debe ser mayor a 0');
    }

    return new CreateSubscriptionDto(tenantId, plan, durationDays);
  }
}
