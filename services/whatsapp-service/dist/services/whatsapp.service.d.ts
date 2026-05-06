export declare class WhatsappService {
    sendMessage(payload: {
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
