import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastData>();
  toast$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error') {
    this.toastSubject.next({ 
      id: Date.now(), // Unique ID for tracking
      message, 
      type 
    });
  }
}