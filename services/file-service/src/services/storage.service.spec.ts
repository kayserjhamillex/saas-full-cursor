import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { StorageService } from "./storage.service";

describe("StorageService", () => {
  it("persiste metadata en disco y se puede leer en una nueva instancia", async () => {
    const tempDir = mkdtempSync(join(tmpdir(), "file-service-storage-"));
    process.env.STORAGE_DATA_DIR = tempDir;

    const firstInstance = new StorageService();
    const saved = await firstInstance.save({
      tenantId: "tenant-1",
      sourceModule: "clinical",
      fileName: "documento.pdf",
      mimeType: "application/pdf",
      fileBase64: Buffer.from("contenido").toString("base64"),
    });

    const secondInstance = new StorageService();
    const recovered = await secondInstance.getById(saved.id);

    expect(recovered).toBeDefined();
    expect(recovered?.id).toBe(saved.id);
    expect(recovered?.tenantId).toBe("tenant-1");
    expect(recovered?.fileName).toBe("documento.pdf");

    rmSync(tempDir, { recursive: true, force: true });
  });
});
