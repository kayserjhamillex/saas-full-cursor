"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementController = void 0;
const common_1 = require("@nestjs/common");
const register_movement_dto_1 = require("./dto/register-movement.dto");
const movement_service_1 = require("../services/movement.service");
let MovementController = class MovementController {
    movementService;
    constructor(movementService) {
        this.movementService = movementService;
    }
    registerMovement(body) {
        return this.movementService.registerMovement(register_movement_dto_1.RegisterMovementDto.from(body));
    }
};
exports.MovementController = MovementController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MovementController.prototype, "registerMovement", null);
exports.MovementController = MovementController = __decorate([
    (0, common_1.Controller)("movements"),
    __metadata("design:paramtypes", [movement_service_1.MovementService])
], MovementController);
//# sourceMappingURL=movement.controller.js.map