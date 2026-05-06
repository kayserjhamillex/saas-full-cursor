export declare class CreateAssetDto {
    readonly tenantId: string;
    readonly categoryId: string;
    readonly code: string;
    readonly name: string;
    readonly description: string | undefined;
    readonly acquisitionDate: string | undefined;
    readonly acquisitionCost: number;
    readonly usefulLifeMonths: number;
    readonly currentValue: number | undefined;
    readonly status: string | undefined;
    constructor(tenantId: string, categoryId: string, code: string, name: string, description: string | undefined, acquisitionDate: string | undefined, acquisitionCost: number, usefulLifeMonths: number, currentValue: number | undefined, status: string | undefined);
    static from(payload: {
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
    }): CreateAssetDto;
}
