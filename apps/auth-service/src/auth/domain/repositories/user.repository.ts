import type { AuthUserForLogin } from '../auth-user-for-login';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findByEmailAndTenant(
    email: string,
    tenantId: string,
  ): Promise<AuthUserForLogin | null>;
}
