import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetKardexQueryDto } from './dto/get-kardex-query.dto';
import { GetStockQueryDto } from './dto/get-stock-query.dto';
import { RegisterStockEntryDto } from './dto/register-stock-entry.dto';
import { TransferStockDto } from './dto/transfer-stock.dto';
import { KardexService } from '../services/kardex.service';
import { MovementService } from '../services/movement.service';
import { StockService } from '../services/stock.service';

@Controller()
export class InventoryController {
  constructor(
    private readonly stockService: StockService,
    private readonly movementService: MovementService,
    private readonly kardexService: KardexService,
  ) {}

  @Post('stock/entries')
  entry(
    @Body()
    body: {
      tenantId?: string;
      productId?: string;
      warehouseId?: string;
      quantity?: number;
      reference?: string;
      notes?: string;
    },
  ) {
    return this.movementService.registerEntry(RegisterStockEntryDto.from(body));
  }

  @Post('stock/exits')
  exit(
    @Body()
    body: {
      tenantId?: string;
      productId?: string;
      warehouseId?: string;
      quantity?: number;
      reference?: string;
      notes?: string;
    },
  ) {
    return this.movementService.registerExit(RegisterStockEntryDto.from(body));
  }

  @Post('stock/transfers')
  transfer(
    @Body()
    body: {
      tenantId?: string;
      productId?: string;
      fromWarehouseId?: string;
      toWarehouseId?: string;
      quantity?: number;
      reference?: string;
      notes?: string;
    },
  ) {
    return this.movementService.transfer(TransferStockDto.from(body));
  }

  @Get('stock/:productId')
  getStock(
    @Param('productId') productId: string,
    @Query('tenantId') tenantId: string | undefined,
    @Query('warehouseId') warehouseId: string | undefined,
  ) {
    const query = GetStockQueryDto.from({ tenantId, productId, warehouseId });
    return this.stockService.getStock(query);
  }

  @Get('kardex/:productId')
  getKardex(
    @Param('productId') productId: string,
    @Query('tenantId') tenantId: string | undefined,
    @Query('warehouseId') warehouseId: string | undefined,
  ) {
    const query = GetKardexQueryDto.from({ tenantId, productId, warehouseId });
    return this.kardexService.getKardex(
      query.tenantId,
      query.productId,
      query.warehouseId,
    );
  }
}
