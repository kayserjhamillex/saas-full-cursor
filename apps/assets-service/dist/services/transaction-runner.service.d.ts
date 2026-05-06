import type { PoolClient } from "pg";
import { DatabaseService } from "./database.service";
export declare class TransactionRunnerService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    runInTransaction<T>(operation: (client: PoolClient) => Promise<T>): Promise<T>;
}
