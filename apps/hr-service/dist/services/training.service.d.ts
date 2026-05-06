import { HrRepository } from '../repositories/hr.repository';
export declare class TrainingService {
    private readonly hrRepository;
    constructor(hrRepository: HrRepository);
    createTraining(payload: {
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
