export declare class TemplateService {
    compile(template: string | undefined, variables: Record<string, unknown> | undefined): {
        template: string;
        renderedBody: string;
        payload: Record<string, unknown>;
    };
}
