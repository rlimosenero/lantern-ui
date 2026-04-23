import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  title: string;
  body: string;
  icon?: string;
  theme?: 'success' | 'warning' | 'info';

  confirmText?: string;
  cancelText?: string;

  showConfirm?: boolean;
  showCancel?: boolean;

  autoClose?: number; // ms
  loading?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  
  private modalState = new Subject<ModalConfig | null>();
  modalState$ = this.modalState.asObservable();

  private response = new Subject<'confirm' | 'cancel' | 'close'>();

  private currentConfig: ModalConfig | null = null;

  open(config: ModalConfig) {
    this.currentConfig = config;
    this.modalState.next(config);
    return this.response.asObservable();
  }

  update(config: Partial<ModalConfig>) {
    if (!this.currentConfig) return;

    this.currentConfig = {
      ...this.currentConfig,
      ...config
    };

    this.modalState.next(this.currentConfig);
  }

  close(action: 'confirm' | 'cancel' | 'close' = 'close') {
    this.modalState.next(null);
    this.response.next(action);
  }

}
