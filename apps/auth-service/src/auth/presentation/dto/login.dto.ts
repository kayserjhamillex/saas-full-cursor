import { BadRequestException } from '@nestjs/common';

export class LoginDto {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly tenantId: string,
  ) {}

  static from(payload: {
    email?: string;
    password?: string;
    tenantId?: string;
  }): LoginDto {
    const email = payload.email?.trim().toLowerCase();
    const password = payload.password?.trim();
    const tenantId = payload.tenantId?.trim();

    if (!email) {
      throw new BadRequestException('email es obligatorio');
    }
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('email invalido');
    }
    if (!password) {
      throw new BadRequestException('password es obligatorio');
    }
    if (!tenantId) {
      throw new BadRequestException('tenantId es obligatorio');
    }

    return new LoginDto(email, password, tenantId);
  }

  private static isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
