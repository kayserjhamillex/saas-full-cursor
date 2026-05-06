import { AssetRepository } from "../repositories/asset.repository";
import { TransactionRunnerService } from "./transaction-runner.service";
export declare class AssignmentService {
    private readonly assetRepository;
    private readonly transactionRunnerService;
    constructor(assetRepository: AssetRepository, transactionRunnerService: TransactionRunnerService);
    assignAsset(payload: {
        tenantId?: string;
        assetId?: string;
        employeeId?: string;
        areaName?: string;
        notes?: string;
    }): Promise<{
        assignment: {
            id: string;
            tenantId: string;
            assetId: string;
            employeeId: string;
            areaName: string | null;
            assignedAt: Date;
            returnedAt: Date | null;
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
        event: string;
    }>;
}
