import { ProductRepository } from '../repositories/product.repository';
import { StockRepository } from '../repositories/stock.repository';
export declare class StockService {
    private readonly productRepository;
    private readonly stockRepository;
    constructor(productRepository: ProductRepository, stockRepository: StockRepository);
    getStock(payload: {
        tenantId?: string;
        productId?: string;
        warehouseId?: string;
    }): Promise<{
        tenantId: string;
        productId: string;
        warehouseId: string;
        quantity: number;
        updatedAt: Date | null;
    }>;
}
