import { MovementService } from "../services/movement.service";
export declare class MovementController {
    private readonly movementService;
    constructor(movementService: MovementService);
    registerMovement(body: {
        tenantId?: string;
        assetId?: string;
        movementType?: string;
        fromLocation?: string;
        toLocation?: string;
        notes?: string;
    }): Promise<{
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
        assignment: {
            id: string;
            tenantId: string;
            assetId: string;
            employeeId: string;
            areaName: string | null;
            assignedAt: Date;
            returnedAt: Date | null;
            notes: string | null;
        } | null;
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
