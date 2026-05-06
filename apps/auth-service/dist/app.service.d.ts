import { JwtService } from '@nestjs/jwt';
type LoginRequest = {
    email?: string;
    password?: string;
    tenantId?: string;
};
export declare class AppService {
    private readonly jwtService;
    private readonly pool;
    constructor(jwtService: JwtService);
    login(payload: LoginRequest): Promise<{
        accessToken: string;
        tokenType: string;
        expiresIn: number;
    }>;
    private findUserByEmailAndTenant;
}
export {};
