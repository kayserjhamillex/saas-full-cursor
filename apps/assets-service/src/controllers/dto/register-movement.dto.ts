import { BadRequestException } from "@nestjs/common";

export class RegisterMovementDto {
  constructor(
    public readonly tenantId: string,
    public readonly assetId: string,
    public readonly movementType: string,
    public readonly fromLocation: string | undefined,
    public readonly toLocation: string | undefined,
    public readonly notes: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    assetId?: string;
    movementType?: string;
    fromLocation?: string;
    toLocation?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const movementType = payload.movementType?.trim();

    if (!tenantId) {
      throw new BadRequestException("tenantId es obligatorio");
    }
    if (!assetId) {
      throw new BadRequestException("assetId es obligatorio");
    }
    if (!movementType) {
      throw new BadRequestException("movementType es obligatorio");
    }

    return new RegisterMovementDto(
      tenantId,
      assetId,
      movementType,
      payload.fromLocation?.trim(),
      payload.toLocation?.trim(),
      payload.notes?.trim(),
    );
  }
}
