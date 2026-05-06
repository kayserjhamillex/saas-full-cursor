"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const pg_1 = require("pg");
let AppService = class AppService {
    jwtService;
    pool = new pg_1.Pool({
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        user: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? '123',
        database: process.env.DB_NAME ?? 'saasodontologico',
    });
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async login(payload) {
        const email = payload.email?.trim().toLowerCase();
        const password = payload.password?.trim();
        const tenantId = payload.tenantId?.trim();
        if (!email || !password || !tenantId) {
            throw new common_1.BadRequestException('email, password y tenantId son obligatorios');
        }
        const user = await this.findUserByEmailAndTenant(email, tenantId);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales invalidas');
        }
        if (user.tenant_status !== 'active') {
            throw new common_1.UnauthorizedException('Tenant inactivo');
        }
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            tenantId: user.tenant_id,
            roleId: user.role_id,
        });
        return {
            accessToken,
            tokenType: 'Bearer',
            expiresIn: 3600,
        };
    }
    async findUserByEmailAndTenant(email, tenantId) {
        const query = `
      SELECT
        u.id,
        u.tenant_id,
        u.email,
        u.password,
        u.role_id,
        t.status AS tenant_status
      FROM users u
      INNER JOIN tenants t ON t.id = u.tenant_id
      WHERE u.email = $1 AND u.tenant_id = $2
      LIMIT 1
    `;
        const result = await this.pool.query(query, [email, tenantId]);
        return result.rows[0];
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AppService);
//# sourceMappingURL=app.service.js.map