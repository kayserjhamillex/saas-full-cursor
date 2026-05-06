/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return -- bcrypt sin tipos explícitos en este paquete */
import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import type { PasswordVerifier } from '../../domain/ports/password-verifier.port';

@Injectable()
export class BcryptPasswordVerifier implements PasswordVerifier {
  async verify(plain: string, hash: string): Promise<boolean> {
    const same = await compare(plain, hash);
    return same;
  }
}
