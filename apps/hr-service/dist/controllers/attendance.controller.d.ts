import { AttendanceService } from '../services/attendance.service';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    register(body: {
        tenantId?: string;
        employeeId?: string;
        checkInAt?: string;
        checkOutAt?: string;
        status?: string;
        notes?: string;
    }): Promise<{
        attendance: import("../domain/attendance.entity").AttendanceEntity;
        event: string;
    }>;
}
