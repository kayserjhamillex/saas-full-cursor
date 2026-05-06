/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../services/database.service';
import { PaymentEntity, PaymentStatus } from '../domain/payment.entity';

type PaymentRow = {
  id: string;
  tenant_id: string;
  amount: number;
  payment_date: Date;
  status: PaymentStatus;
};

const PAYMENT_COLUMNS = `
  id, tenant_id, amount, payment_date, status
`;

const CREATE_PAYMENT_QUERY = `
  INSERT INTO payments (tenant_id, amount, payment_date, status)
  VALUES ($1, $2, NOW(), $3)
  RETURNING ${PAYMENT_COLUMNS}
`;

@Injectable()
export class PaymentRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    tenantId: string,
    amount: number,
    status: PaymentStatus,
  ): Promise<PaymentEntity> {
    const result = await this.databaseService
      .getPool()
      .query<PaymentRow>(CREATE_PAYMENT_QUERY, [tenantId, amount, status]);
    return this.map(result.rows[0]);
  }

  private map(row: PaymentRow): PaymentEntity {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      amount: Number(row.amount),
      paymentDate: row.payment_date,
      status: row.status,
    };
  }
}
