import { EmailService } from '../services/email.service';
export declare class EmailController {
    private readonly emailService;
    constructor(emailService: EmailService);
    send(body: {
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
