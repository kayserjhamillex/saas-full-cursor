import { AssetService } from "../services/asset.service";
export declare class AssetController {
    private readonly assetService;
    constructor(assetService: AssetService);
    createAsset(body: {
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
