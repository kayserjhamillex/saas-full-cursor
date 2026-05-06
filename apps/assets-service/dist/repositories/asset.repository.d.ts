import { PoolClient } from "pg";
import { DatabaseService } from "../services/database.service";
export declare class AssetRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    categoryExists(tenantId: string, categoryId: string): Promise<boolean>;
    employeeExists(tenantId: string, employeeId: string): Promise<boolean>;
    createAsset(payload: {
        tenantId: string;
        categoryId: string;
        code: string;
        name: string;
        description: string | null;
        acquisitionDate: string | null;
        acquisitionCost: number;
        usefulLifeMonths: number;
        currentValue: number;
        status: string;
    }): Promise<{
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
    }>;
    findAssetByIdForUpdate(assetId: string, tenantId: string, client: PoolClient): Promise<{
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
    } | null>;
    findActiveAssignmentByAsset(assetId: string, tenantId: string, client: PoolClient): Promise<{
        id: string;
        tenantId: string;
        assetId: string;
        employeeId: string;
        areaName: string | null;
        assignedAt: Date;
        returnedAt: Date | null;
        notes: string | null;
    } | null>;
    createAssignment(client: PoolClient, payload: {
        tenantId: string;
        assetId: string;
        employeeId: string;
        areaName: string | null;
        notes: string | null;
    }): Promise<{
        id: string;
        tenantId: string;
        assetId: string;
        employeeId: string;
        areaName: string | null;
        assignedAt: Date;
        returnedAt: Date | null;
        notes: string | null;
    }>;
    closeAssignment(assignmentId: string, notes: string | null, client: PoolClient): Promise<{
        id: string;
        tenantId: string;
        assetId: string;
        employeeId: string;
        areaName: string | null;
        assignedAt: Date;
        returnedAt: Date | null;
        notes: string | null;
    }>;
    createMovement(client: PoolClient, payload: {
        tenantId: string;
        assetId: string;
        movementType: string;
        fromLocation: string | null;
        toLocation: string | null;
        notes: string | null;
    }): Promise<{
        id: string;
        tenantId: string;
        assetId: string;
        movementType: string;
        fromLocation: string | null;
        toLocation: string | null;
        movementDate: Date;
        notes: string | null;
    }>;
    updateAssetStatus(assetId: string, status: string, client: PoolClient): Promise<{
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
    }>;
    updateAssetValue(assetId: string, currentValue: number, client: PoolClient): Promise<{
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
    }>;
    createDepreciation(client: PoolClient, payload: {
        tenantId: string;
        assetId: string;
        periodLabel: string;
        amount: number;
        previousValue: number;
        newValue: number;
        method: string;
        financialAccountId: string | null;
        notes: string | null;
    }): Promise<{
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
    }>;
    private mapAsset;
    private mapAssignment;
    private mapMovement;
    private mapDepreciation;
}
