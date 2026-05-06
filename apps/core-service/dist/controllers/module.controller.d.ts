import { ModuleService } from '../services/module.service';
export declare class ModuleController {
    private readonly moduleService;
    constructor(moduleService: ModuleService);
    updateStatus(body: {
        tenantId?: string;
        moduleName?: string;
        isActive?: boolean;
    }): Promise<{
        tenantId: string;
        moduleName: string;
        isActive: boolean;
        event: string;
    }>;
}
