import { BadRequestException } from "@nestjs/common";

export class CreateAssetDto {
  constructor(
    public readonly tenantId: string,
    public readonly categoryId: string,
    public readonly code: string,
    public readonly name: string,
    public readonly description: string | undefined,
    public readonly acquisitionDate: string | undefined,
    public readonly acquisitionCost: number,
    public readonly usefulLifeMonths: number,
    public readonly currentValue: number | undefined,
    public readonly status: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    categoryId?: string;
    code?: string;
    name?: string;
    description?: string;
    acquisitionDate?: string;
    acquisitionCost?: number;
    usefulLifeMonths?: number;
    currentValue?: number;
    status?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const categoryId = payload.categoryId?.trim();
    const code = payload.code?.trim();
    const name = payload.name?.trim();
    const acquisitionCost = payload.acquisitionCost;
    const usefulLifeMonths = payload.usefulLifeMonths;

    if (!tenantId) {
      throw new BadRequestException("tenantId es obligatorio");
    }
    if (!categoryId) {
      throw new BadRequestException("categoryId es obligatorio");
    }
    if (!code) {
      throw new BadRequestException("code es obligatorio");
    }
    if (!name) {
      throw new BadRequestException("name es obligatorio");
    }
    if (
      typeof acquisitionCost !== "number" ||
      Number.isNaN(acquisitionCost) ||
      acquisitionCost < 0
    ) {
      throw new BadRequestException(
        "acquisitionCost debe ser mayor o igual a 0",
      );
    }
    if (
      typeof usefulLifeMonths !== "number" ||
      Number.isNaN(usefulLifeMonths) ||
      usefulLifeMonths <= 0
    ) {
      throw new BadRequestException("usefulLifeMonths debe ser mayor a 0");
    }
    if (payload.currentValue !== undefined) {
      const currentValue = payload.currentValue;
      if (
        typeof currentValue !== "number" ||
        Number.isNaN(currentValue) ||
        currentValue < 0
      ) {
        throw new BadRequestException(
          "currentValue debe ser mayor o igual a 0",
        );
      }
    }

    return new CreateAssetDto(
      tenantId,
      categoryId,
      code,
      name,
      payload.description?.trim(),
      payload.acquisitionDate?.trim(),
      acquisitionCost,
      usefulLifeMonths,
      payload.currentValue,
      payload.status?.trim(),
    );
  }
}
