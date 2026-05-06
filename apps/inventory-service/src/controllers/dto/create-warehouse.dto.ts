import { BadRequestException } from '@nestjs/common';

export class CreateWarehouseDto {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
  ) {}

  static from(payload: { tenantId?: string; name?: string }) {
    const tenantId = payload.tenantId?.trim();
    const name = payload.name?.trim();

    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }

    return new CreateWarehouseDto(tenantId, name);
  }
}
