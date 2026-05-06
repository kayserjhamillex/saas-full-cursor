import { HrRepository } from '../repositories/hr.repository';
export declare class EvaluationService {
    private readonly hrRepository;
    constructor(hrRepository: HrRepository);
    createEvaluation(payload: {
        tenantId?: string;
        employeeId?: string;
        evaluatorName?: string;
        score?: number;
        comments?: string;
        evaluatedAt?: string;
    }): Promise<{
        evaluation: import("../domain/evaluation.entity").EvaluationEntity;
        event: string;
    }>;
}
