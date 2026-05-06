import { ModuleRepository } from '../repositories/module.repository';
export declare class ModuleService {
    private readonly moduleRepository;
    constructor(moduleRepository: ModuleRepository);
    updateModuleStatus(payload: {
        tenantId?: string;
        moduleName?: string;
        isActive?: boolean;
    }): Promise<{
        tenantId: string;
        moduleName: string;
        isActive: boolean;
        event: string;
    }>;
    validateModule(tenantId: string, moduleName: string): Promise<{
        moduleName: string;
        isActive: boolean;
    }>;
}
