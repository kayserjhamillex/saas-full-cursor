import { Body, Controller, Post } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { WarehouseService } from '../services/warehouse.service';

@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  createWarehouse(@Body() body: { tenantId?: string; name?: string }) {
    return this.warehouseService.createWarehouse(CreateWarehouseDto.from(body));
  }
}
