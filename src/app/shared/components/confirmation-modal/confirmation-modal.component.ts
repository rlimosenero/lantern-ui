import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ModalConfig, ModalService } from './modal.service';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-confirmation-modal',
  imports: [
    MatIcon,
    CommonModule
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
  animations: [
    trigger('fadeOverlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleModal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ]
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  config: ModalConfig | null = null;

  private sub!: Subscription;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.sub = this.modalService.modalState$.subscribe(config => {
      this.config = config;

      if (config?.autoClose) {
        timer(config.autoClose).subscribe(() => {
          this.modalService.close('close');
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  confirm() {
    if (this.config?.loading) return;

    // 🔥 set loading immediately
    this.modalService.update({ loading: true });

    this.modalService.close('confirm');
  }

  cancel() {
    this.modalService.close('cancel');
  }

  close() {
    this.modalService.close('close');
  }
}
