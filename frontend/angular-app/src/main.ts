import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';
import { warnIfGatewayMisconfigured } from './environments/validate-gateway';

warnIfGatewayMisconfigured(environment);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
