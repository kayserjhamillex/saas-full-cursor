import { BadRequestException } from '@nestjs/common';

export class CreateTenantDto {
  constructor(public readonly name: string) {}

  static from(payload: { name?: string }) {
    const name = payload.name?.trim();
    if (!name) {
      throw new BadRequestException('name es obligatorio');
    }
    return new CreateTenantDto(name);
  }
}
