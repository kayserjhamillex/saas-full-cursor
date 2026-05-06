import { ProductRepository } from '../repositories/product.repository';
export declare class ProductService {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    createProduct(payload: {
        tenantId?: string;
        categoryId?: string;
        subcategoryId?: string;
        sku?: string;
        name?: string;
        unit?: string;
    }): Promise<{
        product: import("../domain/product.entity").ProductEntity;
        event: string;
    }>;
}
