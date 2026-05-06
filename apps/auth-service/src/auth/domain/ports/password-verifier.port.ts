export const PASSWORD_VERIFIER = Symbol('PASSWORD_VERIFIER');

export interface PasswordVerifier {
  verify(plain: string, hash: string): Promise<boolean>;
}
