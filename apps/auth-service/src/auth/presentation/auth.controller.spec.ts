import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../application/auth.service';

describe('AuthController', () => {
  const loginMock = jest.fn();
  let controller: AuthController;

  beforeEach(async () => {
    loginMock.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: { login: loginMock } }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('GIVEN credenciales validas WHEN login THEN delega a AuthService', async () => {
    loginMock.mockResolvedValue({ accessToken: 't', tokenType: 'Bearer' });

    const result = await controller.login({
      email: 'a@b.com',
      password: 'secret',
      tenantId: 't1',
    });

    expect(loginMock).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'secret',
      tenantId: 't1',
    });
    expect(result).toEqual({ accessToken: 't', tokenType: 'Bearer' });
  });
});
