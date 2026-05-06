"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const crypto_1 = require("crypto");
async function bootstrap() {
    const serviceName = 'scheduling-service';
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use((req, res, next) => {
        const startedAt = Date.now();
        const traceId = req.headers['x-trace-id'] ?? (0, crypto_1.randomUUID)();
        res.setHeader('x-trace-id', traceId);
        res.on('finish', () => {
            console.log(JSON.stringify({ level: 'info', service: serviceName, traceId, method: req.method, path: req.originalUrl, statusCode: res.statusCode, durationMs: Date.now() - startedAt, tenantId: req.headers['x-tenant-id'] ?? null, timestamp: new Date().toISOString() }));
        });
        next();
    });
    expressApp.get('/health', (_req, res) => res.json({ status: 'ok', service: serviceName, timestamp: new Date().toISOString() }));
    expressApp.get('/metrics', (_req, res) => {
        const memory = process.memoryUsage();
        res.setHeader('Content-Type', 'text/plain; version=0.0.4');
        res.send([`nodejs_process_uptime_seconds ${process.uptime()}`, `nodejs_process_resident_memory_bytes ${memory.rss}`, `nodejs_heap_used_bytes ${memory.heapUsed}`].join('\n'));
    });
    app.enableCors({
        origin: [/^http:\/\/localhost:\d+$/],
        credentials: true
    });
    await app.listen(process.env.PORT ?? 3008);
}
bootstrap();
//# sourceMappingURL=main.js.map