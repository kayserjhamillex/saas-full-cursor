/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { DatabaseService } from '../services/database.service';

type FinancialAccountRow = {
  id: string;
  tenant_id: string;
  name: string;
  account_type: string;
  currency: string;
  current_balance: string;
  is_active: boolean;
  created_at: Date;
};

type TransactionRow = {
  id: string;
  tenant_id: string;
  account_id: string;
  transaction_type: string;
  amount: string;
  source_module: string;
  reference: string | null;
  notes: string | null;
  transaction_date: Date;
  created_at: Date;
};

type TransactionDetailRow = {
  id: string;
  transaction_id: string;
  account_id: string;
  entry_type: 'debit' | 'credit';
  amount: string;
  description: string;
};

const CREATE_FINANCIAL_ACCOUNT_QUERY = `
  INSERT INTO financial_accounts (tenant_id, name, account_type, currency, current_balance, is_active, created_at)
  VALUES ($1, $2, $3, $4, $5, true, NOW())
  RETURNING id, tenant_id, name, account_type, currency, current_balance, is_active, created_at
`;

const SELECT_FINANCIAL_ACCOUNTS_BY_TENANT_QUERY = `
  SELECT id, tenant_id, name, account_type, currency, current_balance, is_active, created_at
  FROM financial_accounts
  WHERE tenant_id = $1
  ORDER BY created_at DESC
`;

const SELECT_FINANCIAL_ACCOUNT_FOR_UPDATE_QUERY = `
  SELECT id, tenant_id, name, account_type, currency, current_balance, is_active, created_at
  FROM financial_accounts
  WHERE id = $1 AND tenant_id = $2
  FOR UPDATE
`;

const UPDATE_FINANCIAL_ACCOUNT_BALANCE_QUERY = `
  UPDATE financial_accounts
  SET current_balance = $2
  WHERE id = $1
  RETURNING id, tenant_id, name, account_type, currency, current_balance, is_active, created_at
`;

const CREATE_TRANSACTION_QUERY = `
  INSERT INTO transactions (tenant_id, account_id, transaction_type, amount, source_module, reference, notes, transaction_date, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
  RETURNING id, tenant_id, account_id, transaction_type, amount, source_module, reference, notes, transaction_date, created_at
`;

const CREATE_TRANSACTION_DETAIL_QUERY = `
  INSERT INTO transaction_details (transaction_id, account_id, entry_type, amount, description)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, transaction_id, account_id, entry_type, amount, description
`;

const SELECT_TRANSACTIONS_BY_TENANT_BASE_QUERY = `
  SELECT id, tenant_id, account_id, transaction_type, amount, source_module, reference, notes, transaction_date, created_at
  FROM transactions
  WHERE %FILTERS%
  ORDER BY transaction_date DESC, created_at DESC
`;

@Injectable()
export class FinancialRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createAccount(payload: {
    tenantId: string;
    name: string;
    accountType: string;
    currency: string;
    initialBalance: number;
  }) {
    const result = await this.databaseService
      .getPool()
      .query<FinancialAccountRow>(CREATE_FINANCIAL_ACCOUNT_QUERY, [
        payload.tenantId,
        payload.name,
        payload.accountType,
        payload.currency,
        payload.initialBalance,
      ]);
    return this.mapAccount(result.rows[0]);
  }

  async getAccountsByTenant(tenantId: string) {
    const result = await this.databaseService
      .getPool()
      .query<FinancialAccountRow>(SELECT_FINANCIAL_ACCOUNTS_BY_TENANT_QUERY, [
        tenantId,
      ]);
    return result.rows.map((row) => this.mapAccount(row));
  }

  async findAccountByIdForUpdate(
    accountId: string,
    tenantId: string,
    client: PoolClient,
  ) {
    const result = await client.query<FinancialAccountRow>(
      SELECT_FINANCIAL_ACCOUNT_FOR_UPDATE_QUERY,
      [accountId, tenantId],
    );
    if (result.rows.length === 0) {
      return null;
    }
    return this.mapAccount(result.rows[0]);
  }

  async updateAccountBalance(
    accountId: string,
    nextBalance: number,
    client: PoolClient,
  ) {
    const result = await client.query<FinancialAccountRow>(
      UPDATE_FINANCIAL_ACCOUNT_BALANCE_QUERY,
      [accountId, nextBalance],
    );
    return this.mapAccount(result.rows[0]);
  }

  async createTransaction(
    client: PoolClient,
    payload: {
      tenantId: string;
      accountId: string;
      transactionType: 'income' | 'expense';
      amount: number;
      sourceModule: string;
      reference: string | null;
      notes: string | null;
    },
  ) {
    const result = await client.query<TransactionRow>(
      CREATE_TRANSACTION_QUERY,
      [
        payload.tenantId,
        payload.accountId,
        payload.transactionType,
        payload.amount,
        payload.sourceModule,
        payload.reference,
        payload.notes,
      ],
    );
    return this.mapTransaction(result.rows[0]);
  }

  async createTransactionDetail(
    client: PoolClient,
    payload: {
      transactionId: string;
      accountId: string;
      entryType: 'debit' | 'credit';
      amount: number;
      description: string;
    },
  ) {
    const result = await client.query<TransactionDetailRow>(
      CREATE_TRANSACTION_DETAIL_QUERY,
      [
        payload.transactionId,
        payload.accountId,
        payload.entryType,
        payload.amount,
        payload.description,
      ],
    );
    return result.rows[0];
  }

  async getTransactionsByTenant(
    tenantId: string,
    accountId?: string,
    transactionType?: string,
  ) {
    const params: string[] = [tenantId];
    const filters: string[] = ['tenant_id = $1'];

    if (accountId) {
      params.push(accountId);
      filters.push(`account_id = $${params.length}`);
    }
    if (transactionType) {
      params.push(transactionType);
      filters.push(`transaction_type = $${params.length}`);
    }

    const query = SELECT_TRANSACTIONS_BY_TENANT_BASE_QUERY.replace(
      '%FILTERS%',
      filters.join(' AND '),
    );

    const result = await this.databaseService
      .getPool()
      .query<TransactionRow>(query, params);
    return result.rows.map((row) => this.mapTransaction(row));
  }

  private mapAccount(row: FinancialAccountRow) {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      name: String(row.name),
      accountType: String(row.account_type),
      currency: String(row.currency),
      currentBalance: Number(row.current_balance),
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
    };
  }

  private mapTransaction(row: TransactionRow) {
    return {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      accountId: String(row.account_id),
      transactionType: String(row.transaction_type),
      amount: Number(row.amount),
      sourceModule: String(row.source_module),
      reference: row.reference ?? null,
      notes: row.notes ?? null,
      transactionDate: row.transaction_date,
      createdAt: row.created_at,
    };
  }
}
