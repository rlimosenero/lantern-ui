import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { APP_CONFIG } from '../models/app.config.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  private currentUserSignal = signal<any>(null);

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor() {
    this.hydrateUser();
  }

  authenticate(credentials: any) {
    return this.http.post<any>(`${this.config.baseUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res.flag === 'S' && res.data?.token) {
          this.login(res.data.token);
        }
      })
    );
  }

  login(jwt: string) {
    localStorage.setItem('lantern_jwt', jwt);
    this.currentUserSignal.set(this.decodeToken(jwt));
    this.router.navigate(['/search']);
  }

  logout() {
    localStorage.removeItem('lantern_jwt');
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth/login']);
  }

  private hydrateUser() {
    const token = localStorage.getItem('lantern_jwt');
    if (token) {
      try {
        this.currentUserSignal.set(this.decodeToken(token));
      } catch (e) {
        this.logout();
      }
    }
  }

  private decodeToken(token: string) {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = JSON.parse(atob(payloadBase64));

      return {
        username: decodedJson.sub,
        token: token
      };
    } catch (e) {
      throw new Error('Invalid Token');
    }
  }
}