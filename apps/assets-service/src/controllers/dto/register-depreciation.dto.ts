import { BadRequestException } from "@nestjs/common";

export class RegisterDepreciationDto {
  constructor(
    public readonly tenantId: string,
    public readonly assetId: string,
    public readonly periodLabel: string,
    public readonly amount: number,
    public readonly method: string | undefined,
    public readonly financialAccountId: string | undefined,
    public readonly notes: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    assetId?: string;
    periodLabel?: string;
    amount?: number;
    method?: string;
    financialAccountId?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const periodLabel = payload.periodLabel?.trim();
    const amount = payload.amount;

    if (!tenantId) {
      throw new BadRequestException("tenantId es obligatorio");
    }
    if (!assetId) {
      throw new BadRequestException("assetId es obligatorio");
    }
    if (!periodLabel) {
      throw new BadRequestException("periodLabel es obligatorio");
    }
    if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
      throw new BadRequestException("amount debe ser mayor a 0");
    }

    return new RegisterDepreciationDto(
      tenantId,
      assetId,
      periodLabel,
      amount,
      payload.method?.trim(),
      payload.financialAccountId?.trim(),
      payload.notes?.trim(),
    );
  }
}
