import { AssetRepository } from "../repositories/asset.repository";
import { TransactionRunnerService } from "./transaction-runner.service";
export declare class DepreciationService {
    private readonly assetRepository;
    private readonly transactionRunnerService;
    constructor(assetRepository: AssetRepository, transactionRunnerService: TransactionRunnerService);
    registerDepreciation(payload: {
        tenantId?: string;
        assetId?: string;
        periodLabel?: string;
        amount?: number;
        method?: string;
        financialAccountId?: string;
        notes?: string;
    }): Promise<{
        depreciation: {
            id: string;
            tenantId: string;
            assetId: string;
            periodLabel: string;
            amount: number;
            previousValue: number;
            newValue: number;
            method: string;
            financialAccountId: string | null;
            depreciationDate: Date;
            notes: string | null;
        };
        movement: {
            id: string;
            tenantId: string;
            assetId: string;
            movementType: string;
            fromLocation: string | null;
            toLocation: string | null;
            movementDate: Date;
            notes: string | null;
        };
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
        financialImpact: {
            sourceModule: string;
            amount: number;
            accountId: string | null;
            reference: string;
        };
        event: string;
    }>;
}
