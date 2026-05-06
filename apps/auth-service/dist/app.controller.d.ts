import { AppService } from './app.service';
type LoginRequest = {
    email?: string;
    password?: string;
    tenantId?: string;
};
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    login(body: LoginRequest): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: number;
    }>;
}
export {};
