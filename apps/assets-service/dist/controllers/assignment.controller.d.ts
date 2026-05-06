import { AssignmentService } from "../services/assignment.service";
export declare class AssignmentController {
    private readonly assignmentService;
    constructor(assignmentService: AssignmentService);
    assignAsset(body: {
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
