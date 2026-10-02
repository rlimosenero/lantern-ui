import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { APP_CONFIG } from '../models/app.config.model';
import { AuthResponse, ServiceResponse } from '../models/interface';
import { BreadcrumbService } from '../../shared/components/breadcrumbs/breadcrumbs.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly accessTokenSignal = signal<string | null>(null);
  private readonly currentUserSignal = signal<any>(null);
  private readonly initializedSignal = signal(false);
  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly initialized = computed(() => this.initializedSignal());
  readonly isAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.roles?.includes('ROLE_ADMIN') ?? false;
  });

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    /*
     * Remove JWT values belonging to the old
     * localStorage-based implementation.
     */
    localStorage.removeItem('lantern_jwt');
  }

  authenticate(credentials: { username: string; password: string; }) {

    return this.http.post<ServiceResponse<AuthResponse>>(
      `${this.config.baseUrl}/auth/login`,
      credentials,
      { withCredentials: true }
    ).pipe(tap(response => {
      if (response.flag === 'S' && response.data?.accessToken) {
        this.setAccessToken(response.data.accessToken);
      }
    })
    );
  }

  initializeSession():
    Observable<boolean> {
    return this.refreshAccessToken()
      .pipe(
        map(() => true),
        catchError(() => {
          this.clearLocalSession();

          return of(false);
        }),
        finalize(() => {
          this.initializedSignal
            .set(true);
        })
      );
  }

  refreshAccessToken():
    Observable<ServiceResponse<AuthResponse>> {
    return this.http.post<
      ServiceResponse<AuthResponse>
    >(
      `${this.config.baseUrl}/auth/refresh`,
      {},
      {
        withCredentials: true
      }
    ).pipe(
      tap(response => {
        if (
          response.flag !== 'S'
          || !response.data?.accessToken
        ) {
          throw new Error(
            'Invalid token refresh response.'
          );
        }

        this.setAccessToken(
          response.data.accessToken
        );
      })
    );
  }

  logout(): void {
    this.http.post<ServiceResponse<void>>(
      `${this.config.baseUrl}/auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(finalize(() => {
      this.completeLogout();
    })
    ).subscribe();
  }

  logoutLocally(): void {
    this.completeLogout();
  }

  getAccessToken(): string | null {
    return this.accessTokenSignal();
  }

  private setAccessToken(accessToken: string) {
    this.accessTokenSignal.set(accessToken);

    this.currentUserSignal.set(this.decodeToken(accessToken));
  }

  private completeLogout(): void {
    this.clearLocalSession();

    localStorage.removeItem('app_search_state');
    localStorage.removeItem('global_search_state');
    localStorage.removeItem('web_services_search_state');

    this.breadcrumbService.clearAllOverrides();

    this.router.navigate(['/auth/login']);

  }

  private clearLocalSession(): void {
    this.accessTokenSignal.set(null);
    this.currentUserSignal.set(null);

    localStorage.removeItem('lantern_jwt');
  }

  private decodeToken(token: string): {
    username: string;
    roles: string[];
  } {
    const payloadSegment = token.split('.')[1];

    if (!payloadSegment) {
      throw new Error('Invalid access token.');
    }

    const normalizedPayload = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(paddedPayload));

    return {
      username: decodedPayload.sub,
      roles: decodedPayload.roles ?? []
    };
  }
}