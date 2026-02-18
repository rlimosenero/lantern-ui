import { InjectionToken } from '@angular/core';

export interface AppConfig {
  baseUrl: string;
  production: boolean;
  version?: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');