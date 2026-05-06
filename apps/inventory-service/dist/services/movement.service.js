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
exports.MovementService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("../repositories/product.repository");
const movement_repository_1 = require("../repositories/movement.repository");
const stock_repository_1 = require("../repositories/stock.repository");
let MovementService = class MovementService {
    productRepository;
    stockRepository;
    movementRepository;
    constructor(productRepository, stockRepository, movementRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
        this.movementRepository = movementRepository;
    }
    async registerEntry(payload) {
        const ctx = this.validateMovementPayload(payload);
        return this.mutateSingleStock({
            ...ctx,
            movementType: 'entry',
            quantityIn: ctx.quantity,
            quantityOut: 0,
            delta: ctx.quantity,
            event: 'inventory_entry',
        });
    }
    async registerExit(payload) {
        const ctx = this.validateMovementPayload(payload);
        return this.mutateSingleStock({
            ...ctx,
            movementType: 'exit',
            quantityIn: 0,
            quantityOut: ctx.quantity,
            delta: -ctx.quantity,
            event: 'inventory_exit',
        });
    }
    async transfer(payload) {
        const tenantId = payload.tenantId?.trim();
        const productId = payload.productId?.trim();
        const fromWarehouseId = payload.fromWarehouseId?.trim();
        const toWarehouseId = payload.toWarehouseId?.trim();
        const reference = payload.reference?.trim() ?? null;
        const notes = payload.notes?.trim() ?? null;
        const quantity = Number(payload.quantity ?? 0);
        if (!tenantId || !productId || !fromWarehouseId || !toWarehouseId || quantity <= 0) {
            throw new common_1.BadRequestException('tenantId, productId, fromWarehouseId, toWarehouseId y quantity (>0) son obligatorios');
        }
        if (fromWarehouseId === toWarehouseId) {
            throw new common_1.BadRequestException('El almacen origen y destino deben ser distintos');
        }
        await this.ensureProduct(tenantId, productId);
        const client = await this.movementRepository.getPool().connect();
        try {
            await client.query('BEGIN');
            const origin = await this.stockRepository.findStockForUpdate(tenantId, productId, fromWarehouseId, client);
            if (!origin || origin.quantity < quantity) {
                throw new common_1.BadRequestException('Stock insuficiente para transferencia');
            }
            const destination = (await this.stockRepository.findStockForUpdate(tenantId, productId, toWarehouseId, client)) ??
                (await this.stockRepository.createStock(tenantId, productId, toWarehouseId, 0, client));
            const transfer = await this.movementRepository.createTransfer(client, {
                tenantId,
                productId,
                fromWarehouseId,
                toWarehouseId,
                quantity,
            });
            const updatedOrigin = await this.stockRepository.updateQuantity(origin.id, origin.quantity - quantity, client);
            const updatedDestination = await this.stockRepository.updateQuantity(destination.id, destination.quantity + quantity, client);
            const movementOut = await this.movementRepository.createMovement(client, {
                tenantId,
                productId,
                warehouseId: fromWarehouseId,
                movementType: 'transfer_out',
                quantity,
                reference,
                notes,
                transferId: transfer.id,
            });
            const movementIn = await this.movementRepository.createMovement(client, {
                tenantId,
                productId,
                warehouseId: toWarehouseId,
                movementType: 'transfer_in',
                quantity,
                reference,
                notes,
                transferId: transfer.id,
            });
            const kardexOut = await this.movementRepository.createKardexEntry(client, {
                tenantId,
                productId,
                warehouseId: fromWarehouseId,
                movementId: movementOut.id,
                movementType: 'transfer_out',
                quantityIn: 0,
                quantityOut: quantity,
                balance: updatedOrigin.quantity,
            });
            const kardexIn = await this.movementRepository.createKardexEntry(client, {
                tenantId,
                productId,
                warehouseId: toWarehouseId,
                movementId: movementIn.id,
                movementType: 'transfer_in',
                quantityIn: quantity,
                quantityOut: 0,
                balance: updatedDestination.quantity,
            });
            await client.query('COMMIT');
            return {
                transfer,
                originStock: updatedOrigin,
                destinationStock: updatedDestination,
                movements: [movementOut, movementIn],
                kardex: [kardexOut, kardexIn],
                event: 'transfer_completed',
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
    validateMovementPayload(payload) {
        const tenantId = payload.tenantId?.trim();
        const productId = payload.productId?.trim();
        const warehouseId = payload.warehouseId?.trim();
        const quantity = Number(payload.quantity ?? 0);
        const reference = payload.reference?.trim() ?? null;
        const notes = payload.notes?.trim() ?? null;
        if (!tenantId || !productId || !warehouseId || quantity <= 0) {
            throw new common_1.BadRequestException('tenantId, productId, warehouseId y quantity (>0) son obligatorios');
        }
        return { tenantId, productId, warehouseId, quantity, reference, notes };
    }
    async ensureProduct(tenantId, productId) {
        const product = await this.productRepository.findByIdAndTenant(productId, tenantId);
        if (!product) {
            throw new common_1.BadRequestException('Producto no encontrado en el tenant');
        }
    }
    async mutateSingleStock(payload) {
        await this.ensureProduct(payload.tenantId, payload.productId);
        const client = await this.movementRepository.getPool().connect();
        try {
            await client.query('BEGIN');
            const current = (await this.stockRepository.findStockForUpdate(payload.tenantId, payload.productId, payload.warehouseId, client)) ??
                (await this.stockRepository.createStock(payload.tenantId, payload.productId, payload.warehouseId, 0, client));
            const next = current.quantity + payload.delta;
            if (next < 0) {
                throw new common_1.BadRequestException('No se permite stock negativo');
            }
            const updatedStock = await this.stockRepository.updateQuantity(current.id, next, client);
            const movement = await this.movementRepository.createMovement(client, {
                tenantId: payload.tenantId,
                productId: payload.productId,
                warehouseId: payload.warehouseId,
                movementType: payload.movementType,
                quantity: payload.quantity,
                reference: payload.reference,
                notes: payload.notes,
            });
            const kardex = await this.movementRepository.createKardexEntry(client, {
                tenantId: payload.tenantId,
                productId: payload.productId,
                warehouseId: payload.warehouseId,
                movementId: movement.id,
                movementType: payload.movementType,
                quantityIn: payload.quantityIn,
                quantityOut: payload.quantityOut,
                balance: updatedStock.quantity,
            });
            await client.query('COMMIT');
            return {
                stock: updatedStock,
                movement,
                kardex,
                event: payload.event,
            };
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    }
};
exports.MovementService = MovementService;
exports.MovementService = MovementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository,
        stock_repository_1.StockRepository,
        movement_repository_1.MovementRepository])
], MovementService);
//# sourceMappingURL=movement.service.js.map