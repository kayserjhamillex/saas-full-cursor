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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("../repositories/product.repository");
let ProductService = class ProductService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(payload) {
        const tenantId = payload.tenantId?.trim();
        const categoryId = payload.categoryId?.trim();
        const subcategoryId = payload.subcategoryId?.trim();
        const sku = payload.sku?.trim();
        const name = payload.name?.trim();
        const unit = payload.unit?.trim() ?? 'unidad';
        if (!tenantId || !categoryId || !sku || !name) {
            throw new common_1.BadRequestException('tenantId, categoryId, sku y name son obligatorios');
        }
        const categoryExists = await this.productRepository.categoryExists(tenantId, categoryId);
        if (!categoryExists) {
            throw new common_1.BadRequestException('La categoria no existe para el tenant');
        }
        const product = await this.productRepository.create({
            tenantId,
            categoryId,
            subcategoryId,
            sku,
            name,
            unit,
        });
        return {
            product,
            event: 'product_created',
        };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository])
], ProductService);
//# sourceMappingURL=product.service.js.map