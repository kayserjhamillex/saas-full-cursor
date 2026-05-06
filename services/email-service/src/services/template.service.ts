import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  compile(template: string | undefined, variables: Record<string, unknown> | undefined) {
    const selectedTemplate = template ?? 'generic';
    const payload = variables ?? {};
    return {
      template: selectedTemplate,
      renderedBody: `Plantilla ${selectedTemplate} procesada`,
      payload,
    };
  }
}
