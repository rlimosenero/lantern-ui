import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Import this
import { environment } from '../environments/environment';
import { APP_CONFIG } from './core/models/app.config.model';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { InactivityService } from './core/auth/inactivity.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // scroll to top on navigation
        anchorScrolling: 'enabled'            // support #fragment links too
      })
    ),
    // provideHttpClient(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]) // Registers the interceptor globally
    ),
    provideAnimationsAsync(),
    {
      provide: APP_CONFIG,
      useValue: environment
    },
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      const inactivityService = inject(InactivityService);

      return firstValueFrom(authService.initializeSession()).then(authenticated => {
        if (authenticated) {
          inactivityService.start();
        }
      });
    })
  ]
};
