import { DestroyRef, inject, Injectable } from '@angular/core';
import { fromEvent, merge, Subscription, throttleTime } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastService } from '../../shared/components/toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  // Testing configuration
//   private readonly inactivityLimitMs = 60 * 1000;
//   private readonly proactiveRefreshDelayMs = 45 * 1000;

  // Production configuration
  private readonly inactivityLimitMs = 10 * 60 * 1000;
  private readonly proactiveRefreshDelayMs = 8 * 60 * 1000;

  private activitySubscription?: Subscription;
  private refreshSubscription?: Subscription;

  private inactivityTimer?: ReturnType<typeof setTimeout>;
  private proactiveRefreshTimer?: ReturnType<typeof setTimeout>;

  private lastServerSessionUpdate = 0;
  private activityPending = false;
  private refreshInProgress = false;
  private logoutInProgress = false;
  private started = false;

  constructor() {
    this.destroyRef.onDestroy(() => this.stop());
  }

  start(): void {
    if (this.started) {
      this.activityPending = true;
      this.resetInactivityTimer();
      this.scheduleProactiveRefresh();
      return;
    }

    this.started = true;
    this.activityPending = false;
    this.refreshInProgress = false;
    this.logoutInProgress = false;
    this.lastServerSessionUpdate = Date.now();

    this.activitySubscription = merge(
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'touchstart'),
      fromEvent(document, 'pointerdown'),
      fromEvent(document, 'input'),
      fromEvent(document, 'scroll', { capture: true }),
      fromEvent(window, 'scroll')
    ).pipe(
      throttleTime(1000, undefined, {
        leading: true,
        trailing: true
      })
    ).subscribe(() => this.handleUserActivity());

    this.resetInactivityTimer();
    this.scheduleProactiveRefresh();

    console.debug('[Session] Inactivity monitoring started.');
  }

  stop(): void {
    this.started = false;
    this.activityPending = false;
    this.refreshInProgress = false;

    this.activitySubscription?.unsubscribe();
    this.activitySubscription = undefined;

    this.refreshSubscription?.unsubscribe();
    this.refreshSubscription = undefined;

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
    }

    if (this.proactiveRefreshTimer) {
      clearTimeout(this.proactiveRefreshTimer);
      this.proactiveRefreshTimer = undefined;
    }

    console.debug('[Session] Inactivity monitoring stopped.');
  }

  private handleUserActivity(): void {
    if (!this.authService.isAuthenticated() || this.logoutInProgress) {
      return;
    }

    this.activityPending = true;

    this.resetInactivityTimer();
    this.scheduleProactiveRefresh();

    console.debug('[Session] User activity detected.');
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(
      () => this.handleInactivityLogout(),
      this.inactivityLimitMs
    );
  }

  private scheduleProactiveRefresh(): void {
    if (!this.started || this.logoutInProgress) {
      return;
    }

    if (this.proactiveRefreshTimer) {
      clearTimeout(this.proactiveRefreshTimer);
      this.proactiveRefreshTimer = undefined;
    }

    const elapsedSinceServerUpdate =
      Date.now() - this.lastServerSessionUpdate;

    const remainingDelay = Math.max(
      0,
      this.proactiveRefreshDelayMs - elapsedSinceServerUpdate
    );

    console.debug(
      `[Session] Proactive refresh scheduled in ${remainingDelay} ms.`
    );

    this.proactiveRefreshTimer = setTimeout(() => {
      this.proactiveRefreshTimer = undefined;
      this.refreshWhenActivityOccurred();
    }, remainingDelay);
  }

  private refreshWhenActivityOccurred(): void {
    if (!this.authService.isAuthenticated() || this.logoutInProgress) {
      return;
    }

    if (this.refreshInProgress) {
      console.debug('[Session] Proactive refresh is already running.');
      return;
    }

    if (!this.activityPending) {
      console.debug(
        '[Session] Proactive refresh skipped because no user activity occurred.'
      );
      return;
    }

    this.activityPending = false;
    this.refreshInProgress = true;

    console.debug('[Session] Calling proactive token refresh.');

    this.refreshSubscription = this.authService
      .refreshAccessToken()
      .subscribe({
        next: () => this.handleRefreshSuccess(),
        error: error => {
          console.error(
            '[Session] Proactive token refresh failed.',
            error
          );

          this.refreshInProgress = false;
          this.handleRefreshFailure();
        }
      });
  }

  private handleRefreshSuccess(): void {
    this.refreshInProgress = false;
    this.lastServerSessionUpdate = Date.now();

    console.debug('[Session] Proactive token refresh succeeded.');

    // Schedule another refresh only when activity occurred during the request
    if (this.activityPending) {
      this.scheduleProactiveRefresh();
    }
  }

  private handleInactivityLogout(): void {
    if (!this.authService.isAuthenticated() || this.logoutInProgress) {
      return;
    }

    this.logoutInProgress = true;

    console.info('[Session] Logging out due to inactivity.');

    // Cancel monitoring before logout to prevent a refresh/logout race
    this.stop();

    this.toastService.show(
      'Your session has expired due to inactivity. Please sign in again.',
      'error'
    );

    this.authService.logout();
  }

  private handleRefreshFailure(): void {
    if (this.logoutInProgress) {
      return;
    }

    this.logoutInProgress = true;

    // The refresh session is no longer usable
    this.stop();

    this.toastService.show(
      'Your session has expired. Please sign in again.',
      'error'
    );

    this.authService.logoutLocally();
  }
}