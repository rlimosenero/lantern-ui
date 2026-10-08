import {
  Component,
  inject
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';

import {
  AuthService
} from '../../../core/auth/auth.service';
import {
  InactivityService
} from '../../../core/auth/inactivity.service';
import {
  ButtonComponent
} from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly authService =
    inject(AuthService);

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly router =
    inject(Router);

  private readonly inactivityService =
    inject(InactivityService);

  readonly loginForm =
    this.formBuilder.nonNullable.group({
      username: [
        '',
        Validators.required
      ],
      password: [
        '',
        Validators.required
      ]
    });

  loginInProgress = false;
  loginError: string | null = null;

  onSubmit(): void {
    if (
      this.loginForm.invalid
      || this.loginInProgress
    ) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials =
      this.loginForm.getRawValue();

    this.loginInProgress = true;
    this.loginError = null;

    this.authService
      .authenticate(credentials)
      .pipe(
        finalize(() => {
          this.loginInProgress = false;
        })
      )
      .subscribe({
        next: response => {
          if (response.flag !== 'S') {
            this.loginError =
              response.message
              ?? 'Login failed.';

            return;
          }

          this.inactivityService.start();

          void this.router.navigate([
            '/search'
          ]);
        },

        error: error => {
          console.error(
            'Login failed',
            error
          );

          this.loginError =
            error?.error?.message
            ?? 'Invalid username or password.';
        }
      });
  }
}