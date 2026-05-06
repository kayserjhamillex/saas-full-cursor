import { Injectable, Logger } from "@nestjs/common";

type QueueJob = {
  id: string;
  attempts: number;
  maxAttempts: number;
  payload: {
    tenantId: string;
    to: string;
    subject: string;
    content: string;
  };
};

@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);
  private readonly maxRetries = Math.max(
    0,
    Number(process.env.EMAIL_QUEUE_MAX_RETRIES ?? 3),
  );
  private readonly retryDelayMs = Math.max(
    100,
    Number(process.env.EMAIL_QUEUE_RETRY_DELAY_MS ?? 400),
  );

  enqueue(job: Omit<QueueJob, "attempts" | "maxAttempts">) {
    const queueJob: QueueJob = {
      ...job,
      attempts: 0,
      maxAttempts: this.maxRetries,
    };
    void this.runJob(queueJob);
  }

  private async runJob(job: QueueJob) {
    for (let attempt = 0; attempt <= job.maxAttempts; attempt += 1) {
      try {
        await this.simulateProviderSend({ ...job, attempts: attempt });
        return;
      } catch (error) {
        if (attempt < job.maxAttempts) {
          this.logger.warn(
            `Reintentando envio email job=${job.id} intento=${attempt + 1}/${job.maxAttempts}`,
          );
          await this.delay(this.retryDelayMs * (attempt + 1));
          continue;
        }
        this.logger.error(
          `Fallo definitivo enviando email job=${job.id} tenant=${job.payload.tenantId}: ${String(error)}`,
        );
      }
    }
  }

  private async simulateProviderSend(job: QueueJob) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    this.logger.log(
      `Email enviado job=${job.id} tenant=${job.payload.tenantId} to=${job.payload.to} subject=${job.payload.subject}`,
    );
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
