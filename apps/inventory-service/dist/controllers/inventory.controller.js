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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const kardex_service_1 = require("../services/kardex.service");
const movement_service_1 = require("../services/movement.service");
const stock_service_1 = require("../services/stock.service");
let InventoryController = class InventoryController {
    stockService;
    movementService;
    kardexService;
    constructor(stockService, movementService, kardexService) {
        this.stockService = stockService;
        this.movementService = movementService;
        this.kardexService = kardexService;
    }
    entry(body) {
        return this.movementService.registerEntry(body);
    }
    exit(body) {
        return this.movementService.registerExit(body);
    }
    transfer(body) {
        return this.movementService.transfer(body);
    }
    getStock(productId, tenantId, warehouseId) {
        return this.stockService.getStock({ tenantId, productId, warehouseId });
    }
    getKardex(productId, tenantId, warehouseId) {
        return this.kardexService.getKardex(tenantId ?? '', productId, warehouseId);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)('stock/entries'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "entry", null);
__decorate([
    (0, common_1.Post)('stock/exits'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "exit", null);
__decorate([
    (0, common_1.Post)('stock/transfers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "transfer", null);
__decorate([
    (0, common_1.Get)('stock/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getStock", null);
__decorate([
    (0, common_1.Get)('kardex/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('tenantId')),
    __param(2, (0, common_1.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getKardex", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [stock_service_1.StockService,
        movement_service_1.MovementService,
        kardex_service_1.KardexService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map