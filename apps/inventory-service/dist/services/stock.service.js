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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("../repositories/product.repository");
const stock_repository_1 = require("../repositories/stock.repository");
let StockService = class StockService {
    productRepository;
    stockRepository;
    constructor(productRepository, stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }
    async getStock(payload) {
        const tenantId = payload.tenantId?.trim();
        const productId = payload.productId?.trim();
        const warehouseId = payload.warehouseId?.trim();
        if (!tenantId || !productId || !warehouseId) {
            throw new common_1.BadRequestException('tenantId, productId y warehouseId son obligatorios');
        }
        const product = await this.productRepository.findByIdAndTenant(productId, tenantId);
        if (!product) {
            throw new common_1.BadRequestException('Producto no encontrado en el tenant');
        }
        const stock = await this.stockRepository.findStock(tenantId, productId, warehouseId);
        return {
            tenantId,
            productId,
            warehouseId,
            quantity: stock?.quantity ?? 0,
            updatedAt: stock?.updatedAt ?? null,
        };
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository,
        stock_repository_1.StockRepository])
], StockService);
//# sourceMappingURL=stock.service.js.map