import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  catchError,
  tap,
  throwError
} from 'rxjs';

import {
  ToastService
} from '../../shared/components/toast/toast.service';

export const errorInterceptor:
HttpInterceptorFn = (request, next) => {
  const toast = inject(ToastService);
  const url = request.url.toLowerCase();

  const isLoginRequest =    url.includes('/auth/login');
  const isRefreshRequest =    url.includes('/auth/refresh');
  const isLogoutRequest = url.includes('/auth/logout');
  const isActivityRequest = url.includes('/auth/activity');

  const suppressEndpointToast =
    url.includes('/filters')
    || url.includes('/filter')
    || url.includes('/version')
    || url.includes('/local-files');

  return next(request).pipe(
    tap(event => {
      if (!(event instanceof HttpResponse)) {
        return;
      }

      const body = event.body as {
        flag?: string;
        message?: string;
      } | null;

      if (
        body?.flag === 'F'
        && !suppressEndpointToast
        && !isRefreshRequest
        && !isActivityRequest
        && !isLogoutRequest
      ) {
        toast.show(
          body.message || 'Action failed',
          'error'
        );

        return;
      }

      const showSuccessToast =
        body?.flag === 'S'
        && (
          url.includes('/import')
          || isLoginRequest
        );

      if (showSuccessToast) {
        toast.show(
          body.message || 'Success',
          'success'
        );
      }
    }),

    catchError((error: HttpErrorResponse) => {
      /*
       * Never show a toast for refresh or logout requests.
       *
       * The auth interceptor is responsible for deciding
       * whether a failed refresh should end the session.
       */
      const suppressToast =
        isRefreshRequest
        || isActivityRequest
        || isLogoutRequest
        || suppressEndpointToast;

      if (!suppressToast) {
        toast.show(
          getErrorMessage(
            error,
            isLoginRequest
          ),
          'error'
        );
      }

      return throwError(() => error);
    })
  );
};

function getErrorMessage(
  error: HttpErrorResponse,
  isLoginRequest: boolean
): string {
  if (isLoginRequest && error.status === 401) {
    return error.error?.message
      || 'Invalid username or password.';
  }

  if (error.status === 0) {
    return 'Connection to server lost.';
  }

  if (error.status === 403) {
    return error.error?.message
      || 'You do not have permission to perform this action.';
  }

  return error.error?.message
    || error.message
    || 'An unexpected error occurred.';
}