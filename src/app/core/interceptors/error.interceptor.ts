import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/toast/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const url = req.url.toLowerCase();

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body: any = event.body;

        if (body && body.flag === 'F') {
          if (!url.includes('/filters')) {
            toast.show(body.message || 'Action failed', 'error');
          }
        }

        else if (body && body.flag === 'S') {
          // Only show success toast if it's an import or login endpoint
          const isWhitelisted = url.includes('/import') || url.includes('/login');

          if (isWhitelisted) {
            toast.show(body.message || 'Success', 'success');
          }
        }
      }
    }),
    catchError((error) => {
      const isFilterRequest = url.includes('/filters') || url.includes('/filter');
      if (!isFilterRequest) {
        let msg = error.error?.message || 'Connection to server lost';
        toast.show(msg, 'error');
      }

      return throwError(() => error);
    })
  );
};