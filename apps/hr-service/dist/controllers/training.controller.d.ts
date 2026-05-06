import { TrainingService } from '../services/training.service';
export declare class TrainingController {
    private readonly trainingService;
    constructor(trainingService: TrainingService);
    create(body: {
        tenantId?: string;
        employeeId?: string;
        title?: string;
        provider?: string;
        status?: string;
        completedAt?: string;
    }): Promise<{
        training: import("../domain/training.entity").TrainingEntity;
        event: string;
    }>;
}
