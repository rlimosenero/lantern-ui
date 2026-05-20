import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { first } from 'rxjs';

import { ButtonComponent } from '../button/button.component';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ModalService } from '../confirmation-modal/modal.service';
import { ReplaceUnderscorePipe } from '../../pipes/replace-underscore/replace-underscore.pipe';

import { UpstreamAppFormsModalService } from './upstream-app-forms-modal.service';

@Component({
  selector: 'app-upstream-app-forms-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    DatepickerComponent,
    ReplaceUnderscorePipe
  ],
  templateUrl: './upstream-app-forms-modal.component.html',
  styleUrl: './upstream-app-forms-modal.component.scss',
})
export class UpstreamAppFormsModalComponent {

  @Output() close = new EventEmitter<boolean>();

  readonly dropdowns = {

    relationship: [
      'INTERNAL_APPLICATION',
      'PARTNER_COMPANY_APPLICATION',
    ],

    networkMode: [
      'PUBLIC_INTERNET',
      'SITE_TO_SITE_VPN',
      'CLIENT_TO_SITE_VPN',
      'PRIVATE_PEERING_DEDICATED_LINKS',
      'EAST_WEST_TRAFFIC',
      'INTRA_CLUSTER_NETWORKING',
      'EDGE_OR_CDNS'
    ]
  };

  readonly initialPayload = {
    appApiUuid: null,
    appUuid: null,
    appName: '',
    description: '',
    relationship: '',
    appOwner: '',
    techOwner: '',
    networkMode: '',
    tokenExpiryDate: '',
    upstreamAppUuid: null
  };

  payload: any = { ...this.initialPayload };

  isOpen = false;
  isEditMode = false;

  private initialSnapshot = '';

  constructor(
    private modalService: ModalService,
    private upstreamModalService: UpstreamAppFormsModalService
  ) {
    this.listenToModalState();
  }

  private listenToModalState(): void {

    this.upstreamModalService
      .getState()
      .subscribe((cfg: any) => {

        this.isOpen = !!cfg;

        if (!cfg) return;

        this.initializeModal(cfg);
      });
  }

  private initializeModal(cfg: any): void {

    this.isEditMode = !!cfg.details;

    this.payload = {
      ...this.initialPayload,
      appApiUuid: cfg.appApiUuid,
      appUuid: cfg.appUuid
    };

    if (this.isEditMode) {

      this.mapDetails(cfg.details);

    } else {

      this.setDefaultDates();
    }

    this.takeSnapshot();
  }

  private setDefaultDates(): void {

    this.payload.tokenExpiryDate =
      this.formatDate(Date.now());
  }

  private mapDetails(data: any): void {

    this.payload = {
      ...this.payload,
      ...data,

      tokenExpiryDate:
        data.tokenExpiryDate ||
        data.tokenExpiry ||
        ''
    };
  }


  takeSnapshot(): void {
    this.initialSnapshot =
      JSON.stringify(this.payload);
  }

  hasChanges(): boolean {
    return JSON.stringify(this.payload)
      !== this.initialSnapshot;
  }

  isSaveDisabled(form: NgForm): boolean {

    if (!form.valid) {
      return true;
    }

    if (this.isEditMode) {
      return !this.hasChanges();
    }

    return false;
  }

  preparePayload() {

    return {
      appApiUuid: this.payload.appApiUuid,
      appUuid: this.payload.appUuid,
      appName: this.payload.appName,
      description: this.payload.description,
      relationship: this.payload.relationship,
      businessOwner: this.payload.appOwner,
      technicalOwner: this.payload.techOwner,
      networkMode: this.payload.networkMode,
      tokenExpiry: this.payload.tokenExpiryDate || null
    };
  }

  onSave(): void {

    this.openConfirmationModal(
      'Save',
      'Are you sure you want to save?'
    )
      .subscribe((res) => {

        if (res !== 'confirm') return;

        this.setLoadingState();

        const payload = this.preparePayload();

        const request$ = this.isEditMode
          ? this.upstreamModalService.updateUpstreamApplication(
            payload,
            this.payload.upstreamAppUuid
          )
          : this.upstreamModalService.addUpstreamApplication(
            payload
          );

        request$.subscribe({

          next: () => {
            this.handleSuccess('Saved successfully.');
          },

          error: () => {
            this.handleError();
          }
        });
      });
  }


  onDelete(): void {

    this.openConfirmationModal(
      'Delete',
      'Are you sure you want to delete?'
    )
      .subscribe((res) => {

        if (res !== 'confirm') return;

        this.setLoadingState();

        this.upstreamModalService
          .deleteUpstreamApplication(
            this.payload.upstreamAppUuid
          )
          .subscribe({

            next: () => {
              this.handleSuccess(
                'Deleted successfully.'
              );
            },

            error: () => {
              this.handleError();
            }
          });
      });
  }

  private openConfirmationModal(
    title: string,
    body: string
  ) {

    return this.modalService.open({
      title,
      body,
      icon: 'warning',
      theme: 'warning',
      showConfirm: true,
      showCancel: true
    }).pipe(first());
  }

  private setLoadingState(): void {

    this.modalService.update({
      title: 'Processing...',
      loading: true,
      showConfirm: false
    });
  }

  private handleSuccess(message: string): void {

    this.modalService.update({
      title: 'Success!',
      body: message,
      icon: 'check_circle',
      theme: 'success',
      loading: false,
      autoClose: 1500,
      showCancel: false
    });

    setTimeout(() => {
      this.closeModal(true);
    }, 1600);
  }

  private handleError(): void {

    this.modalService.update({
      title: 'Error',
      body: 'Request failed.',
      theme: 'warning',
      loading: false,
      autoClose: 1500,
      showCancel: false
    });
  }


  closeModal(result: boolean = false): void {

    this.payload = {
      ...this.initialPayload
    };

    this.isEditMode = false;

    this.upstreamModalService.close(result);
  }

  formatDate(date: number | Date): string {

    const d = new Date(date);

    const year = d.getFullYear();

    const month = String(
      d.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      d.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}