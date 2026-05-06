import { BadRequestException } from '@nestjs/common';

export class CreateProductDto {
  constructor(
    public readonly tenantId: string,
    public readonly categoryId: string,
    public readonly subcategoryId: string | undefined,
    public readonly sku: string,
    public readonly name: string,
    public readonly unit: string | undefined,
  ) {}

  static from(payload: {
    tenantId?: string;
    categoryId?: string;
    subcategoryId?: string;
    sku?: string;
    name?: string;
    unit?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const categoryId = payload.categoryId?.trim();
    const sku = payload.sku?.trim();
    const name = payload.name?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!categoryId) {
      throw new BadRequestException('categoryId es obligatorio');
    }
    if (!sku) {
      throw new BadRequestException('sku es obligatorio');
    }
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }

    return new CreateProductDto(
      tenantId,
      categoryId,
      payload.subcategoryId?.trim(),
      sku,
      name,
      payload.unit?.trim(),
    );
  }
}
