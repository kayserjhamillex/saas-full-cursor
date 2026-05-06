import { BadRequestException } from '@nestjs/common';

export class GatewayLoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly tenantId: string,
  ) {}

  static from(payload: {
    email?: string;
    password?: string;
    tenantId?: string;
  }) {
    const email = payload.email?.trim();
    const password = payload.password?.trim();
    const tenantId = payload.tenantId?.trim();

    if (!email) {
      throw new BadRequestException('email es obligatorio');
    }
    if (!password) {
      throw new BadRequestException('password es obligatorio');
    }
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }

    return new GatewayLoginDto(email, password, tenantId);
  }
}
