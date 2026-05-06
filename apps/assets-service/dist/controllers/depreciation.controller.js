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
exports.DepreciationController = void 0;
const common_1 = require("@nestjs/common");
const register_depreciation_dto_1 = require("./dto/register-depreciation.dto");
const depreciation_service_1 = require("../services/depreciation.service");
let DepreciationController = class DepreciationController {
    depreciationService;
    constructor(depreciationService) {
        this.depreciationService = depreciationService;
    }
    registerDepreciation(body) {
        return this.depreciationService.registerDepreciation(register_depreciation_dto_1.RegisterDepreciationDto.from(body));
    }
};
exports.DepreciationController = DepreciationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DepreciationController.prototype, "registerDepreciation", null);
exports.DepreciationController = DepreciationController = __decorate([
    (0, common_1.Controller)("depreciation"),
    __metadata("design:paramtypes", [depreciation_service_1.DepreciationService])
], DepreciationController);
//# sourceMappingURL=depreciation.controller.js.map