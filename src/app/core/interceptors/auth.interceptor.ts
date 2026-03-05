import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('lantern_jwt');

let authReq = req;

if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check for expired or invalid token status codes
      if (error.status === 401 || error.status === 403) {
        console.error('Session expired or unauthorized. Redirecting to login...');
        

        authService.logout(); 
      }

      return throwError(() => error);
    })
  );
};