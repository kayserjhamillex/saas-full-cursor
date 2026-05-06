import { Module } from '@nestjs/common';
import { InventoryController } from '../controllers/inventory.controller';
import { ProductController } from '../controllers/product.controller';
import { WarehouseController } from '../controllers/warehouse.controller';
import { InternalServiceTokenGuard } from '../guards/internal-service-token.guard';
import { MovementRepository } from '../repositories/movement.repository';
import { ProductRepository } from '../repositories/product.repository';
import { StockRepository } from '../repositories/stock.repository';
import { WarehouseRepository } from '../repositories/warehouse.repository';
import { DatabaseService } from '../services/database.service';
import { KardexService } from '../services/kardex.service';
import { MovementService } from '../services/movement.service';
import { ProductService } from '../services/product.service';
import { StockService } from '../services/stock.service';
import { TransactionRunnerService } from '../services/transaction-runner.service';
import { WarehouseService } from '../services/warehouse.service';

@Module({
  controllers: [ProductController, WarehouseController, InventoryController],
  providers: [
    DatabaseService,
    ProductRepository,
    StockRepository,
    MovementRepository,
    WarehouseRepository,
    ProductService,
    WarehouseService,
    StockService,
    MovementService,
    TransactionRunnerService,
    KardexService,
    InternalServiceTokenGuard,
  ],
})
export class InventoryModule {}
