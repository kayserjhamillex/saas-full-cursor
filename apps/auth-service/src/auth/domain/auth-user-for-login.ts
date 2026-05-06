export type AuthUserForLogin = {
  id: string;
  tenantId: string;
  email: string;
  /** Hash almacenado (bcrypt) */
  passwordHash: string;
  roleId: string | null;
  tenantStatus: string;
};
