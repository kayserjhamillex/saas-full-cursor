export declare class RegisterMovementDto {
    readonly tenantId: string;
    readonly assetId: string;
    readonly movementType: string;
    readonly fromLocation: string | undefined;
    readonly toLocation: string | undefined;
    readonly notes: string | undefined;
    constructor(tenantId: string, assetId: string, movementType: string, fromLocation: string | undefined, toLocation: string | undefined, notes: string | undefined);
    static from(payload: {
        tenantId?: string;
        assetId?: string;
        movementType?: string;
        fromLocation?: string;
        toLocation?: string;
        notes?: string;
    }): RegisterMovementDto;
}
