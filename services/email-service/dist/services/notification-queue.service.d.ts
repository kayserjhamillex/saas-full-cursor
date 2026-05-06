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
export declare class NotificationQueueService {
    private readonly logger;
    private readonly maxRetries;
    private readonly retryDelayMs;
    enqueue(job: Omit<QueueJob, "attempts" | "maxAttempts">): void;
    private runJob;
    private simulateProviderSend;
    private delay;
}
export {};
