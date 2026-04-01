import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Import this
import { environment } from '../environments/environment';
import { APP_CONFIG } from './core/models/app.config.model';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provideHttpClient(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]) // Registers the interceptor globally
    ),
    provideAnimationsAsync(),
    {
      provide: APP_CONFIG,
      useValue: environment
    }
  ]
};
