import { OnModuleDestroy } from '@nestjs/common';
export declare class DatabaseService implements OnModuleDestroy {
    private readonly pool;
    getPool(): any;
    onModuleDestroy(): Promise<void>;
}
