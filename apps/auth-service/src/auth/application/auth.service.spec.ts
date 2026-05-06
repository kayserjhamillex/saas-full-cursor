import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PASSWORD_VERIFIER } from '../domain/ports/password-verifier.port';
import { USER_REPOSITORY } from '../domain/repositories/user.repository';
import type { UserRepository } from '../domain/repositories/user.repository';

describe('AuthService', () => {
  let service: AuthService;
  const jwtService = { signAsync: jest.fn().mockResolvedValue('jwt-token') };
  const userRepository: jest.Mocked<UserRepository> = {
    findByEmailAndTenant: jest.fn(),
  };
  const passwordVerifier = { verify: jest.fn() };

  beforeEach(async () => {
    passwordVerifier.verify.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: userRepository },
        { provide: PASSWORD_VERIFIER, useValue: passwordVerifier },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository.findByEmailAndTenant.mockReset();
  });

  it('GIVEN credenciales validas WHEN login THEN emite token', async () => {
    userRepository.findByEmailAndTenant.mockResolvedValue({
      id: 'u1',
      tenantId: 't1',
      email: 'a@b.com',
      passwordHash: 'hash',
      roleId: null,
      tenantStatus: 'active',
    });
    passwordVerifier.verify.mockResolvedValue(true);

    const result = await service.login({
      email: 'a@b.com',
      password: 'secret',
      tenantId: 't1',
    });

    expect(result.accessToken).toBe('jwt-token');
    expect(jwtService.signAsync).toHaveBeenCalled();
    expect(passwordVerifier.verify).toHaveBeenCalledWith('secret', 'hash');
  });

  it('GIVEN usuario inexistente WHEN login THEN rechaza con Unauthorized', async () => {
    userRepository.findByEmailAndTenant.mockResolvedValue(null);

    await expect(
      service.login({ email: 'a@b.com', password: 'x', tenantId: 't1' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('GIVEN password incorrecto WHEN login THEN rechaza con Unauthorized', async () => {
    userRepository.findByEmailAndTenant.mockResolvedValue({
      id: 'u1',
      tenantId: 't1',
      email: 'a@b.com',
      passwordHash: 'hash',
      roleId: null,
      tenantStatus: 'active',
    });
    passwordVerifier.verify.mockResolvedValue(false);

    await expect(
      service.login({ email: 'a@b.com', password: 'wrong', tenantId: 't1' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('GIVEN tenant inactivo WHEN login THEN rechaza con Unauthorized', async () => {
    userRepository.findByEmailAndTenant.mockResolvedValue({
      id: 'u1',
      tenantId: 't1',
      email: 'a@b.com',
      passwordHash: 'hash',
      roleId: null,
      tenantStatus: 'suspended',
    });
    passwordVerifier.verify.mockResolvedValue(true);

    await expect(
      service.login({ email: 'a@b.com', password: 'secret', tenantId: 't1' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
