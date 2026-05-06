import { NotificationQueueService } from "./notification-queue.service";

describe("NotificationQueueService", () => {
  it("reintenta y termina enviando cuando un intento falla", async () => {
    process.env.EMAIL_QUEUE_MAX_RETRIES = "2";
    process.env.EMAIL_QUEUE_RETRY_DELAY_MS = "1";

    const service = new NotificationQueueService();
    const sendSpy = jest
      .spyOn(
        service as unknown as {
          simulateProviderSend: (job: unknown) => Promise<void>;
        },
        "simulateProviderSend",
      )
      .mockRejectedValueOnce(new Error("fallo temporal"))
      .mockResolvedValueOnce();

    service.enqueue({
      id: "job-1",
      payload: {
        tenantId: "tenant-a",
        to: "qa@example.com",
        subject: "hola",
        content: "contenido",
      },
    });

    await waitFor(() => sendSpy.mock.calls.length >= 2, 500);

    expect(sendSpy).toHaveBeenCalledTimes(2);
  });
});

async function waitFor(
  predicate: () => boolean,
  timeoutMs: number,
): Promise<void> {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("Timeout esperando condicion de prueba");
    }
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}
