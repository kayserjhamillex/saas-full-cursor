import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
export declare class ServiceExceptionFilter implements ExceptionFilter {
    private readonly serviceName;
    constructor(serviceName: string);
    catch(exception: unknown, host: ArgumentsHost): void;
    private normalizeHttpException;
}
