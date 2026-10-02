import { DestroyRef, inject, Injectable } from '@angular/core';
import { fromEvent, merge, Subscription, throttleTime } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class InactivityService {

    private readonly authService = inject(AuthService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly inactivityLimitMs = 10 * 60 * 1000;
    private activitySubscription?: Subscription;
    private inactivityTimer?: ReturnType<typeof setTimeout>;
    private started = false;

    start(): void {
        if (this.started) {
            this.resetTimer();
            return;
        }

        this.started = true;

        this.activitySubscription =
            merge(
                fromEvent(document, 'mousedown'),
                fromEvent(document, 'keydown'),
                fromEvent(document, 'touchstart'),
                fromEvent(document, 'scroll')
            ).pipe(throttleTime(1000)).subscribe(() => {
                if (this.authService.isAuthenticated()) {
                    this.resetTimer();
                }
            });

        this.resetTimer();

        this.destroyRef.onDestroy(() => {
            this.stop();
        });
    }

    stop(): void {
        this.started = false;
        this.activitySubscription?.unsubscribe();
        this.activitySubscription = undefined;

        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = undefined;
        }
    }

    resetTimer(): void {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }

        this.inactivityTimer =
            setTimeout(() => {
                if (this.authService.isAuthenticated()) {
                    this.stop();
                    this.authService.logout();
                }
            }, this.inactivityLimitMs);
    }
    
}
