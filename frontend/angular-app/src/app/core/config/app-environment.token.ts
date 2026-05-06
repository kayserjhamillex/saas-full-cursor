import { InjectionToken } from '@angular/core';
import type { AppEnvironment } from '../../../environments/environment';
import { environment } from '../../../environments/environment';

export const APP_ENVIRONMENT = new InjectionToken<AppEnvironment>('app.environment', {
  providedIn: 'root',
  factory: (): AppEnvironment => environment,
});
