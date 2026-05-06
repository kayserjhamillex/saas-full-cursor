import { ClinicalService } from '../services/clinical.service';
export declare class OdontogramController {
    private readonly clinicalService;
    constructor(clinicalService: ClinicalService);
    updateOdontogram(body: {
        tenantId?: string;
        patientId?: string;
        chartData?: Record<string, unknown>;
    }): Promise<import("../domain/odontogram.entity").OdontogramEntity>;
}
