import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PASSWORD_VERIFIER,
  type PasswordVerifier,
} from '../domain/ports/password-verifier.port';
import {
  USER_REPOSITORY,
  type UserRepository,
} from '../domain/repositories/user.repository';

export type LoginInput = {
  email: string;
  password: string;
  tenantId: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(PASSWORD_VERIFIER)
    private readonly passwordVerifier: PasswordVerifier,
  ) {}

  async login(payload: LoginInput) {
    const email = payload.email.trim().toLowerCase();
    const password = payload.password.trim();
    const tenantId = payload.tenantId.trim();

    const user = await this.userRepository.findByEmailAndTenant(
      email,
      tenantId,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const isPasswordValid = await this.passwordVerifier.verify(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    if (user.tenantStatus !== 'active') {
      throw new UnauthorizedException('Tenant inactivo');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roleId: user.roleId,
      iss: 'auth-service',
      aud: 'api-gateway',
    });

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }
}
