/* Los tipos del driver `pg` no se resuelven de forma fiable con el `projectService`
   de ESLint en este paquete; el acceso a Pool/query queda acotado a esta capa. */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import type { AuthUserForLogin } from '../../domain/auth-user-for-login';
import type { UserRepository } from '../../domain/repositories/user.repository';

type AuthUserRow = {
  id: string;
  tenant_id: string;
  email: string;
  password: string;
  role_id: string | null;
  tenant_status: string;
};

@Injectable()
export class PgUserRepository implements UserRepository, OnModuleDestroy {
  private readonly pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '123',
    database: process.env.DB_NAME ?? 'saasodontologico',
  });

  async onModuleDestroy() {
    await this.pool.end();
  }

  async findByEmailAndTenant(
    email: string,
    tenantId: string,
  ): Promise<AuthUserForLogin | null> {
    const query = `
      SELECT
        u.id,
        u.tenant_id,
        u.email,
        u.password,
        u.role_id,
        t.status AS tenant_status
      FROM users u
      INNER JOIN tenants t ON t.id = u.tenant_id
      WHERE u.email = $1 AND u.tenant_id = $2
      LIMIT 1
    `;

    const result = await this.pool.query<AuthUserRow>(query, [email, tenantId]);
    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      tenantId: row.tenant_id,
      email: row.email,
      passwordHash: row.password,
      roleId: row.role_id,
      tenantStatus: row.tenant_status,
    };
  }
}
