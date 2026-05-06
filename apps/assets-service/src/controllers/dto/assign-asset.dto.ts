import { BadRequestException } from "@nestjs/common";

export class AssignAssetDto {
  constructor(
    public readonly tenantId: string,
    public readonly assetId: string,
    public readonly employeeId: string,
    public readonly areaName: string | undefined,
    public readonly notes: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    assetId?: string;
    employeeId?: string;
    areaName?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const assetId = payload.assetId?.trim();
    const employeeId = payload.employeeId?.trim();

    if (!tenantId) {
      throw new BadRequestException("tenantId es obligatorio");
    }
    if (!assetId) {
      throw new BadRequestException("assetId es obligatorio");
    }
    if (!employeeId) {
      throw new BadRequestException("employeeId es obligatorio");
    }

    return new AssignAssetDto(
      tenantId,
      assetId,
      employeeId,
      payload.areaName?.trim(),
      payload.notes?.trim(),
    );
  }
}
