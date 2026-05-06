import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { randomUUID } from "crypto";
import type { Express, NextFunction, Request, Response } from "express";

function ensureRequiredEnv() {
  const requiredEnvVars = ["PORT"];
  const missingEnvVars = requiredEnvVars.filter((envVar) => {
    const value = process.env[envVar];
    return !value || value.trim().length === 0;
  });

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias: ${missingEnvVars.join(", ")}`,
    );
  }
}

async function bootstrap() {
  ensureRequiredEnv();
  const serviceName = "whatsapp-service";
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance() as Express;
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now();
    const traceIdHeader = req.headers["x-trace-id"];
    const traceId =
      typeof traceIdHeader === "string" && traceIdHeader.trim().length > 0
        ? traceIdHeader
        : randomUUID();
    res.setHeader("x-trace-id", traceId);
    res.on("finish", () => {
      console.log(
        JSON.stringify({
          level: "info",
          service: serviceName,
          traceId,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt,
          tenantId: req.headers["x-tenant-id"] ?? null,
          timestamp: new Date().toISOString(),
        }),
      );
    });
    next();
  });
  expressApp.get("/health", (_req: Request, res: Response) =>
    res.json({
      status: "ok",
      service: serviceName,
      timestamp: new Date().toISOString(),
    }),
  );
  expressApp.get("/metrics", (_req: Request, res: Response) => {
    const memory = process.memoryUsage();
    res.setHeader("Content-Type", "text/plain; version=0.0.4");
    res.send(
      [
        `nodejs_process_uptime_seconds ${process.uptime()}`,
        `nodejs_process_resident_memory_bytes ${memory.rss}`,
        `nodejs_heap_used_bytes ${memory.heapUsed}`,
      ].join("\n"),
    );
  });
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/],
    credentials: true,
  });
  app.setGlobalPrefix("whatsapp");
  await app.listen(process.env.PORT);
}
void bootstrap();
