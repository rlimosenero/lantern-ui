import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(null);


  currentUser = computed(() => this.currentUserSignal());
  isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');

  constructor() {
    this.hydrateUser();
  }

  login(jwt: string) {
    localStorage.setItem('lantern_jwt', jwt);
    this.currentUserSignal.set(this.decodeToken(jwt));

    this.router.navigate(['/application']);
  }

  logout() {
    localStorage.removeItem('lantern_jwt');
    this.currentUserSignal.set(null);

    this.router.navigate(['/auth/login']);
  }

  private hydrateUser() {
    const token = localStorage.getItem('lantern_jwt');
    if (token) {
      this.currentUserSignal.set(this.decodeToken(token));
    }
  }

  private decodeToken(token: string): User {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = JSON.parse(atob(payloadBase64));

      console.log(decodedJson)
      return {
        id: decodedJson.id,
        name: decodedJson.name,
        role: decodedJson.role,
        token: token
      };
    } catch (e) {
      this.logout();
      throw new Error('Invalid Token');
    }
  }
}
