import { EvaluationService } from '../services/evaluation.service';
export declare class EvaluationController {
    private readonly evaluationService;
    constructor(evaluationService: EvaluationService);
    create(body: {
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
