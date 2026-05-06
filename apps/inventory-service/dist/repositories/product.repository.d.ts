import { ProductEntity } from '../domain/product.entity';
import { DatabaseService } from '../services/database.service';
export declare class ProductRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    categoryExists(tenantId: string, categoryId: string): Promise<boolean>;
    create(payload: {
        tenantId: string;
        categoryId: string;
        subcategoryId?: string | null;
        sku: string;
        name: string;
        unit: string;
    }): Promise<ProductEntity>;
    findByIdAndTenant(productId: string, tenantId: string): Promise<ProductEntity | null>;
    private map;
}
