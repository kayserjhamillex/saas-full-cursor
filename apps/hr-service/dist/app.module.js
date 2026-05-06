"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const attendance_controller_1 = require("./controllers/attendance.controller");
const employee_controller_1 = require("./controllers/employee.controller");
const evaluation_controller_1 = require("./controllers/evaluation.controller");
const payroll_controller_1 = require("./controllers/payroll.controller");
const training_controller_1 = require("./controllers/training.controller");
const hr_repository_1 = require("./repositories/hr.repository");
const attendance_service_1 = require("./services/attendance.service");
const database_service_1 = require("./services/database.service");
const employee_service_1 = require("./services/employee.service");
const evaluation_service_1 = require("./services/evaluation.service");
const payroll_service_1 = require("./services/payroll.service");
const training_service_1 = require("./services/training.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            employee_controller_1.EmployeeController,
            attendance_controller_1.AttendanceController,
            evaluation_controller_1.EvaluationController,
            payroll_controller_1.PayrollController,
            training_controller_1.TrainingController,
        ],
        providers: [
            database_service_1.DatabaseService,
            hr_repository_1.HrRepository,
            employee_service_1.EmployeeService,
            attendance_service_1.AttendanceService,
            evaluation_service_1.EvaluationService,
            payroll_service_1.PayrollService,
            training_service_1.TrainingService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map