"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const inventory_controller_1 = require("./controllers/inventory.controller");
const product_controller_1 = require("./controllers/product.controller");
const warehouse_controller_1 = require("./controllers/warehouse.controller");
const movement_repository_1 = require("./repositories/movement.repository");
const product_repository_1 = require("./repositories/product.repository");
const stock_repository_1 = require("./repositories/stock.repository");
const database_service_1 = require("./services/database.service");
const kardex_service_1 = require("./services/kardex.service");
const movement_service_1 = require("./services/movement.service");
const product_service_1 = require("./services/product.service");
const stock_service_1 = require("./services/stock.service");
const warehouse_service_1 = require("./services/warehouse.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController, product_controller_1.ProductController, warehouse_controller_1.WarehouseController, inventory_controller_1.InventoryController],
        providers: [
            app_service_1.AppService,
            database_service_1.DatabaseService,
            product_repository_1.ProductRepository,
            stock_repository_1.StockRepository,
            movement_repository_1.MovementRepository,
            product_service_1.ProductService,
            warehouse_service_1.WarehouseService,
            stock_service_1.StockService,
            movement_service_1.MovementService,
            kardex_service_1.KardexService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map