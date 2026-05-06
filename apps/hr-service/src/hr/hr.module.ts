import { Module } from '@nestjs/common';
import { AttendanceController } from '../controllers/attendance.controller';
import { EmployeeController } from '../controllers/employee.controller';
import { EvaluationController } from '../controllers/evaluation.controller';
import { PayrollController } from '../controllers/payroll.controller';
import { TrainingController } from '../controllers/training.controller';
import { InternalServiceTokenGuard } from '../guards/internal-service-token.guard';
import { HrRepository } from '../repositories/hr.repository';
import { AttendanceService } from '../services/attendance.service';
import { DatabaseService } from '../services/database.service';
import { EmployeeService } from '../services/employee.service';
import { EvaluationService } from '../services/evaluation.service';
import { PayrollService } from '../services/payroll.service';
import { TrainingService } from '../services/training.service';

@Module({
  controllers: [
    EmployeeController,
    AttendanceController,
    EvaluationController,
    PayrollController,
    TrainingController,
  ],
  providers: [
    DatabaseService,
    HrRepository,
    EmployeeService,
    AttendanceService,
    EvaluationService,
    PayrollService,
    TrainingService,
    InternalServiceTokenGuard,
  ],
})
export class HrModule {}
