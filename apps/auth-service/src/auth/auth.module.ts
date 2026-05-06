import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/auth.service';
import { PASSWORD_VERIFIER } from './domain/ports/password-verifier.port';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { BcryptPasswordVerifier } from './infrastructure/crypto/bcrypt-password.verifier';
import { PgUserRepository } from './infrastructure/persistence/pg-user.repository';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: PgUserRepository,
    },
    {
      provide: PASSWORD_VERIFIER,
      useClass: BcryptPasswordVerifier,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
