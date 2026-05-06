export declare class RegisterDepreciationDto {
    readonly tenantId: string;
    readonly assetId: string;
    readonly periodLabel: string;
    readonly amount: number;
    readonly method: string | undefined;
    readonly financialAccountId: string | undefined;
    readonly notes: string | undefined;
    constructor(tenantId: string, assetId: string, periodLabel: string, amount: number, method: string | undefined, financialAccountId: string | undefined, notes: string | undefined);
    static from(payload: {
        tenantId?: string;
        assetId?: string;
        periodLabel?: string;
        amount?: number;
        method?: string;
        financialAccountId?: string;
        notes?: string;
    }): RegisterDepreciationDto;
}
