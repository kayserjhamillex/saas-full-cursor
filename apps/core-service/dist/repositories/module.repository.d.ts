import { DatabaseService } from '../services/database.service';
type TenantModuleRow = {
    module_name: string;
    is_active: boolean;
};
export declare class ModuleRepository {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    upsert(tenantId: string, moduleName: string, isActive: boolean): Promise<void>;
    listByTenant(tenantId: string): Promise<TenantModuleRow[]>;
    disableAllByTenant(tenantId: string): Promise<void>;
}
export {};
