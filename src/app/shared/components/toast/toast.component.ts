import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  @Input() position: 'top' | 'bottom' = 'top';

  toasts: any[] = [];

  ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      
      // Auto-remove after 5 seconds
      setTimeout(() => this.remove(toast.id), 5000);
    });
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
