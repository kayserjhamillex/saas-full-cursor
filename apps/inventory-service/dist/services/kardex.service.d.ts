import { MovementRepository } from '../repositories/movement.repository';
export declare class KardexService {
    private readonly movementRepository;
    constructor(movementRepository: MovementRepository);
    getKardex(tenantId: string, productId: string, warehouseId?: string): Promise<any>;
}
