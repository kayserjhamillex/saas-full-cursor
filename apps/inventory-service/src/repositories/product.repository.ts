/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- Infraestructura SQL con driver pg */
import { Injectable } from '@nestjs/common';
import { ProductEntity } from '../domain/product.entity';
import { DatabaseService } from '../services/database.service';

type ProductRow = {
  id: string;
  tenant_id: string;
  category_id: string;
  subcategory_id: string | null;
  sku: string;
  name: string;
  unit: string;
  created_at: Date;
  deleted_at: Date | null;
};

type CategoryRow = { id: string };

const PRODUCT_COLUMNS = `
  id, tenant_id, category_id, subcategory_id, sku, name, unit, created_at, deleted_at
`;

const CATEGORY_EXISTS_QUERY = `
  SELECT id
  FROM categories
  WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
  LIMIT 1
`;

const CREATE_PRODUCT_QUERY = `
  INSERT INTO products (tenant_id, category_id, subcategory_id, sku, name, unit, created_at, deleted_at)
  VALUES ($1, $2, $3, $4, $5, $6, NOW(), NULL)
  RETURNING ${PRODUCT_COLUMNS}
`;

const SELECT_PRODUCT_BY_ID_AND_TENANT_QUERY = `
  SELECT ${PRODUCT_COLUMNS}
  FROM products
  WHERE id = $1 AND tenant_id = $2 AND deleted_at IS NULL
  LIMIT 1
`;

@Injectable()
export class ProductRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async categoryExists(tenantId: string, categoryId: string): Promise<boolean> {
    const result = await this.databaseService
      .getPool()
      .query<CategoryRow>(CATEGORY_EXISTS_QUERY, [categoryId, tenantId]);
    return result.rows.length > 0;
  }

  async create(payload: {
    tenantId: string;
    categoryId: string;
    subcategoryId?: string | null;
    sku: string;
    name: string;
    unit: string;
  }): Promise<ProductEntity> {
    const result = await this.databaseService
      .getPool()
      .query<ProductRow>(CREATE_PRODUCT_QUERY, [
        payload.tenantId,
        payload.categoryId,
        payload.subcategoryId ?? null,
        payload.sku,
        payload.name,
        payload.unit,
      ]);
    return this.map(result.rows[0]);
  }

  async findByIdAndTenant(
    productId: string,
    tenantId: string,
  ): Promise<ProductEntity | null> {
    const result = await this.databaseService
      .getPool()
      .query<ProductRow>(SELECT_PRODUCT_BY_ID_AND_TENANT_QUERY, [
        productId,
        tenantId,
      ]);
    return result.rows[0] ? this.map(result.rows[0]) : null;
  }

  private map(row: ProductRow): ProductEntity {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      categoryId: row.category_id,
      subcategoryId: row.subcategory_id,
      sku: row.sku,
      name: row.name,
      unit: row.unit,
      createdAt: row.created_at,
      deletedAt: row.deleted_at,
    };
  }
}
