import { ProductService } from '../services/product.service';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    createProduct(body: {
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
