/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access -- Tipos inferidos desde repositorios SQL */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { MovementRepository } from '../repositories/movement.repository';
import { StockRepository } from '../repositories/stock.repository';
import { TransactionRunnerService } from './transaction-runner.service';

@Injectable()
export class MovementService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly stockRepository: StockRepository,
    private readonly movementRepository: MovementRepository,
    private readonly transactionRunnerService: TransactionRunnerService,
  ) {}

  async registerEntry(payload: {
    tenantId?: string;
    productId?: string;
    warehouseId?: string;
    quantity?: number;
    reference?: string;
    notes?: string;
  }) {
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

  async registerExit(payload: {
    tenantId?: string;
    productId?: string;
    warehouseId?: string;
    quantity?: number;
    reference?: string;
    notes?: string;
  }) {
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

  async transfer(payload: {
    tenantId?: string;
    productId?: string;
    fromWarehouseId?: string;
    toWarehouseId?: string;
    quantity?: number;
    reference?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const productId = payload.productId?.trim();
    const fromWarehouseId = payload.fromWarehouseId?.trim();
    const toWarehouseId = payload.toWarehouseId?.trim();
    const reference = payload.reference?.trim() ?? null;
    const notes = payload.notes?.trim() ?? null;
    const quantity = Number(payload.quantity ?? 0);

    if (
      !tenantId ||
      !productId ||
      !fromWarehouseId ||
      !toWarehouseId ||
      quantity <= 0
    ) {
      throw new BadRequestException(
        'tenantId, productId, fromWarehouseId, toWarehouseId y quantity (>0) son obligatorios',
      );
    }
    if (fromWarehouseId === toWarehouseId) {
      throw new BadRequestException(
        'El almacen origen y destino deben ser distintos',
      );
    }
    await this.ensureProduct(tenantId, productId);

    return this.transactionRunnerService.runInTransaction(async (client) => {
      const origin = await this.stockRepository.findStockForUpdate(
        tenantId,
        productId,
        fromWarehouseId,
        client,
      );
      if (!origin || origin.quantity < quantity) {
        throw new BadRequestException('Stock insuficiente para transferencia');
      }

      const destination =
        (await this.stockRepository.findStockForUpdate(
          tenantId,
          productId,
          toWarehouseId,
          client,
        )) ??
        (await this.stockRepository.createStock(
          tenantId,
          productId,
          toWarehouseId,
          0,
          client,
        ));

      const transfer = await this.movementRepository.createTransfer(client, {
        tenantId,
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity,
      });

      const updatedOrigin = await this.stockRepository.updateQuantity(
        origin.id,
        origin.quantity - quantity,
        client,
      );
      const updatedDestination = await this.stockRepository.updateQuantity(
        destination.id,
        destination.quantity + quantity,
        client,
      );

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

      const kardexOut = await this.movementRepository.createKardexEntry(
        client,
        {
          tenantId,
          productId,
          warehouseId: fromWarehouseId,
          movementId: movementOut.id,
          movementType: 'transfer_out',
          quantityIn: 0,
          quantityOut: quantity,
          balance: updatedOrigin.quantity,
        },
      );
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

      return {
        transfer,
        originStock: updatedOrigin,
        destinationStock: updatedDestination,
        movements: [movementOut, movementIn],
        kardex: [kardexOut, kardexIn],
        event: 'transfer_completed',
      };
    });
  }

  private validateMovementPayload(payload: {
    tenantId?: string;
    productId?: string;
    warehouseId?: string;
    quantity?: number;
    reference?: string;
    notes?: string;
  }) {
    const tenantId = payload.tenantId?.trim();
    const productId = payload.productId?.trim();
    const warehouseId = payload.warehouseId?.trim();
    const quantity = Number(payload.quantity ?? 0);
    const reference = payload.reference?.trim() ?? null;
    const notes = payload.notes?.trim() ?? null;

    if (!tenantId || !productId || !warehouseId || quantity <= 0) {
      throw new BadRequestException(
        'tenantId, productId, warehouseId y quantity (>0) son obligatorios',
      );
    }
    return { tenantId, productId, warehouseId, quantity, reference, notes };
  }

  private async ensureProduct(tenantId: string, productId: string) {
    const product = await this.productRepository.findByIdAndTenant(
      productId,
      tenantId,
    );
    if (!product) {
      throw new BadRequestException('Producto no encontrado en el tenant');
    }
  }

  private async mutateSingleStock(payload: {
    tenantId: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    reference: string | null;
    notes: string | null;
    movementType: 'entry' | 'exit';
    quantityIn: number;
    quantityOut: number;
    delta: number;
    event: 'inventory_entry' | 'inventory_exit';
  }) {
    await this.ensureProduct(payload.tenantId, payload.productId);
    return this.transactionRunnerService.runInTransaction(async (client) => {
      const current =
        (await this.stockRepository.findStockForUpdate(
          payload.tenantId,
          payload.productId,
          payload.warehouseId,
          client,
        )) ??
        (await this.stockRepository.createStock(
          payload.tenantId,
          payload.productId,
          payload.warehouseId,
          0,
          client,
        ));

      const next = current.quantity + payload.delta;
      if (next < 0) {
        throw new BadRequestException('No se permite stock negativo');
      }

      const updatedStock = await this.stockRepository.updateQuantity(
        current.id,
        next,
        client,
      );
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

      return {
        stock: updatedStock,
        movement,
        kardex,
        event: payload.event,
      };
    });
  }
}
