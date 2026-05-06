import { AccountService } from '../services/account.service';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    create(body: {
        tenantId?: string;
        name?: string;
        accountType?: string;
        currency?: string;
        initialBalance?: number;
    }): Promise<{
        account: {
            id: string;
            tenantId: string;
            name: string;
            accountType: string;
            currency: string;
            currentBalance: number;
            isActive: boolean;
            createdAt: Date;
        };
        event: string;
    }>;
    list(tenantId: string | undefined): Promise<{
        tenantId: string;
        accounts: any;
        total: any;
    }>;
}
