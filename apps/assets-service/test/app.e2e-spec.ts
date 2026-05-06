import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import { ServiceExceptionFilter } from "../src/shared/filters/service-exception.filter";

type ErrorEnvelopeResponse = {
  body: {
    success: boolean;
    service: string;
    error: {
      httpStatus: number;
      message: string;
    };
  };
};

describe("AssetsService (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ServiceExceptionFilter("assets-service"));
    app.setGlobalPrefix("assets");
    await app.init();
  });

  it("rechaza create asset sin tenantId", () => {
    return request(app.getHttpServer())
      .post("/assets/assets")
      .send({
        categoryId: "cat-1",
        code: "AST-001",
        name: "Sillon dental",
        acquisitionCost: 1000,
        usefulLifeMonths: 48,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.service).toBe("assets-service");
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe("tenantId es obligatorio");
      });
  });

  it("rechaza depreciation con amount invalido", () => {
    return request(app.getHttpServer())
      .post("/assets/depreciation")
      .send({
        tenantId: "tenant-1",
        assetId: "asset-1",
        periodLabel: "2026-04",
        amount: 0,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe("amount debe ser mayor a 0");
      });
  });

  it("rechaza assignment sin employeeId", () => {
    return request(app.getHttpServer())
      .post("/assets/assignments")
      .send({
        tenantId: "tenant-1",
        assetId: "asset-1",
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe("employeeId es obligatorio");
      });
  });

  it("rechaza create asset con acquisitionCost invalido", () => {
    return request(app.getHttpServer())
      .post("/assets/assets")
      .send({
        tenantId: "tenant-1",
        categoryId: "cat-1",
        code: "AST-001",
        name: "Sillon dental",
        acquisitionCost: -10,
        usefulLifeMonths: 48,
      })
      .expect(400)
      .expect((response: ErrorEnvelopeResponse) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error.httpStatus).toBe(400);
        expect(response.body.error.message).toBe(
          "acquisitionCost debe ser mayor o igual a 0",
        );
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
