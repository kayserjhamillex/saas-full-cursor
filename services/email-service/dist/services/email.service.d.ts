import { NotificationQueueService } from './notification-queue.service';
import { TemplateService } from './template.service';
export declare class EmailService {
    private readonly templateService;
    private readonly notificationQueueService;
    constructor(templateService: TemplateService, notificationQueueService: NotificationQueueService);
    sendEmail(payload: {
        tenantId?: string;
        to?: string;
        subject?: string;
        template?: string;
        variables?: Record<string, unknown>;
    }): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        event: string;
        status: string;
        tenantId: string;
        to: string;
        subject: string;
        content: string;
        templateData: {
            template: string;
            renderedBody: string;
            payload: Record<string, unknown>;
        };
        provider: string;
        sentAt: string;
    };
}
