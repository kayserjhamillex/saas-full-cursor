export declare class AssignAssetDto {
    readonly tenantId: string;
    readonly assetId: string;
    readonly employeeId: string;
    readonly areaName: string | undefined;
    readonly notes: string | undefined;
    constructor(tenantId: string, assetId: string, employeeId: string, areaName: string | undefined, notes: string | undefined);
    static from(payload: {
        tenantId?: string;
        assetId?: string;
        employeeId?: string;
        areaName?: string;
        notes?: string;
    }): AssignAssetDto;
}
