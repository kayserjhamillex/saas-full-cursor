import { AssetRepository } from '../repositories/asset.repository';
export declare class AssetService {
    private readonly assetRepository;
    constructor(assetRepository: AssetRepository);
    createAsset(payload: {
        tenantId?: string;
        categoryId?: string;
        code?: string;
        name?: string;
        description?: string;
        acquisitionDate?: string;
        acquisitionCost?: number;
        usefulLifeMonths?: number;
        currentValue?: number;
        status?: string;
    }): Promise<{
        asset: {
            id: string;
            tenantId: string;
            categoryId: string;
            code: string;
            name: string;
            description: string | null;
            acquisitionDate: Date | null;
            acquisitionCost: number;
            usefulLifeMonths: number;
            currentValue: number;
            status: string;
            createdAt: Date;
            updatedAt: Date;
        };
        event: string;
    }>;
}
