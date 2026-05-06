import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool = new Pool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '123',
    database: process.env.DB_NAME ?? 'saasodontologico',
  });

  getPool() {
    return this.pool;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
