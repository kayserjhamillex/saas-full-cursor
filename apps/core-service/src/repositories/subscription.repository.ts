/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import {
  SubscriptionEntity,
  SubscriptionStatus,
} from '../domain/subscription.entity';

type SubscriptionRow = {
  id: string;
  tenant_id: string;
  plan: string;
  start_date: Date;
  end_date: Date;
  status: SubscriptionStatus;
};

const SUBSCRIPTION_COLUMNS = `
  id, tenant_id, plan, start_date, end_date, status
`;

const CREATE_SUBSCRIPTION_QUERY = `
  INSERT INTO subscriptions (tenant_id, plan, start_date, end_date, status)
  VALUES ($1, $2, $3, $4, 'active')
  RETURNING ${SUBSCRIPTION_COLUMNS}
`;

const SELECT_ACTIVE_SUBSCRIPTION_BY_TENANT_QUERY = `
  SELECT ${SUBSCRIPTION_COLUMNS}
  FROM subscriptions
  WHERE tenant_id = $1 AND status = 'active'
  ORDER BY end_date DESC
  LIMIT 1
`;

const EXPIRE_OVERDUE_SUBSCRIPTIONS_QUERY = `
  UPDATE subscriptions
  SET status = 'expired'
  WHERE status = 'active' AND end_date < $1
  RETURNING tenant_id
`;

const REACTIVATE_LATEST_SUBSCRIPTION_QUERY = `
  UPDATE subscriptions
  SET status = 'active', end_date = $2
  WHERE id = (
    SELECT id
    FROM subscriptions
    WHERE tenant_id = $1
    ORDER BY end_date DESC
    LIMIT 1
  )
`;

@Injectable()
export class SubscriptionRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    tenantId: string,
    plan: string,
    startDate: Date,
    endDate: Date,
  ): Promise<SubscriptionEntity> {
    const result = await this.databaseService
      .getPool()
      .query<SubscriptionRow>(CREATE_SUBSCRIPTION_QUERY, [
        tenantId,
        plan,
        startDate,
        endDate,
      ]);
    return this.map(result.rows[0]);
  }

  async findActiveByTenantId(
    tenantId: string,
  ): Promise<SubscriptionEntity | null> {
    const result = await this.databaseService
      .getPool()
      .query<SubscriptionRow>(SELECT_ACTIVE_SUBSCRIPTION_BY_TENANT_QUERY, [
        tenantId,
      ]);
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  async expireOverdueSubscriptions(currentDate: Date): Promise<string[]> {
    const result = await this.databaseService.getPool().query<{
      tenant_id: string;
    }>(EXPIRE_OVERDUE_SUBSCRIPTIONS_QUERY, [currentDate]);
    return result.rows.map((row) => row.tenant_id);
  }

  async reactivateLatest(tenantId: string, extensionDate: Date): Promise<void> {
    await this.databaseService
      .getPool()
      .query(REACTIVATE_LATEST_SUBSCRIPTION_QUERY, [tenantId, extensionDate]);
  }

  private map(row: SubscriptionRow): SubscriptionEntity {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      plan: row.plan,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
    };
  }
}
