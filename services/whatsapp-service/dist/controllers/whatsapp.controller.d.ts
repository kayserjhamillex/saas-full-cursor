import { WhatsappService } from '../services/whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    send(body: {
        tenantId?: string;
        phoneNumber?: string;
        message?: string;
        eventType?: string;
    }): {
        id: `${string}-${string}-${string}-${string}-${string}`;
        event: string;
        status: string;
        tenantId: string;
        phoneNumber: string;
        provider: string;
        eventType: string;
        message: string;
        sentAt: string;
    };
}
