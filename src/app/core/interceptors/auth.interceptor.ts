import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, map, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

let refreshRequest$: Observable<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {

  const authService = inject(AuthService);
  const authenticationRequest = isAuthenticationRequest(request.url);
  const accessToken = authService.getAccessToken();
  const outgoingRequest = accessToken && !authenticationRequest ? request.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` }
  }) : request;

  return next(outgoingRequest).pipe(
    catchError(
      (error: HttpErrorResponse) => {
        if (error.status !== 401 || authenticationRequest) {
          return throwError(() => error);

        }

        if (!refreshRequest$) {
          refreshRequest$ = authService.refreshAccessToken().pipe(
            map(() => {
              const refreshedToken = authService.getAccessToken();

              if (!refreshedToken) {
                throw new Error('No refreshed access token was returned.');
              }

              return refreshedToken;
            }),
            catchError(refreshError => {
              authService.logoutLocally();

              return throwError(() => refreshError);

            }

            ),
            finalize(() => {
              refreshRequest$ = null;
            }),
            shareReplay({
              bufferSize: 1,
              refCount: false
            })
          );
        }

        return refreshRequest$.pipe(
          switchMap(
            refreshedToken => {
              const retriedRequest = request.clone({
                setHeaders: {
                  Authorization:
                    `Bearer ${refreshedToken}`
                }
              });

              return next(
                retriedRequest
              );
            }
          )
        );
      }
    )
  );
};

function isAuthenticationRequest(url: string): boolean {
  return url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout');

}