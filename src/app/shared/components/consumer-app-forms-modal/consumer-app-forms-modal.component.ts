import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { first } from 'rxjs';

import { ButtonComponent } from '../button/button.component';
import { ModalService } from '../confirmation-modal/modal.service';
import { ConsumerAppFormsModalService } from './consumer-app-forms-modal.service';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ReplaceUnderscorePipe } from '../../pipes/replace-underscore/replace-underscore.pipe';

@Component({
  selector: 'app-consumer-app-forms-modal',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    DatepickerComponent,
    ReplaceUnderscorePipe
  ],
  templateUrl: './consumer-app-forms-modal.component.html',
  styleUrl: './consumer-app-forms-modal.component.scss',
})
export class ConsumerAppFormsModalComponent {

  @Output() close = new EventEmitter<any>();

  isOpen = false;
  isEditMode = false;

  initialSnapshot = '';

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
    ],

    status: [
      'ACTIVE',
      'FOR_DEPRECATION',
      'DEPRECATED',
      'FOR_RETIREMENT',
      'RETIRED'
    ]
  };

  payload: any = this.createEmptyPayload();

  constructor(
    private modalService: ModalService,
    private consumerModalService: ConsumerAppFormsModalService
  ) {

    this.consumerModalService
      .getState()
      .subscribe((cfg: any) => this.handleModalState(cfg));

  }


  private handleModalState(cfg: any): void {

    this.isOpen = !!cfg;

    if (!cfg) {
      return;
    }

    this.isEditMode = !!cfg.details;

    this.initializePayload(cfg);

    this.takeSnapshot();
  }

  private initializePayload(cfg: any): void {

    this.payload = {
      ...this.createEmptyPayload(),
      appApiUuid: cfg.appApiUuid
    };

    if (cfg.details) {

      this.mapDetails(cfg.details);

      return;
    }

    this.initializeDefaultDates();
  }

  private initializeDefaultDates(): void {

    const today = this.formatDate(new Date());

    this.payload.dateOnboarded = today;
    this.payload.tokenExpiryDate = today;
  }


  private createEmptyPayload() {

    return {
      consumerUuid: null,
      appApiUuid: null,

      appName: '',
      description: '',

      relationship: '',

      appOwner: '',
      techOwner: '',

      trigger: '',
      appType: '',
      networkMode: '',

      dateOnboarded: '',
      tokenExpiryDate: '',

      status: ''
    };
  }

  mapDetails(data: any): void {

    this.payload = {
      ...this.payload,
      ...data,

      dateOnboarded: data.dateOnboarded || '',
      tokenExpiryDate:
        data.tokenExpiryDate ||
        data.tokenExpiry ||
        ''
    };
  }

  preparePayload() {

    return {
      appApiUuid: this.payload.appApiUuid,

      appName: this.payload.appName,
      description: this.payload.description,

      relationship: this.payload.relationship,

      businessOwner: this.payload.appOwner,
      technicalOwner: this.payload.techOwner,

      trigger: this.payload.trigger,
      appType: this.payload.appType,
      networkMode: this.payload.networkMode,

      dateOnboarded:
        this.payload.dateOnboarded || null,

      tokenExpiry:
        this.payload.tokenExpiryDate || null,

      status: this.payload.status
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

  isSaveDisabled(form: any): boolean {

    if (!form.valid) {
      return true;
    }

    return this.isEditMode
      ? !this.hasChanges()
      : false;
  }


  onSave(): void {

    this.openConfirmationModal(
      'Save',
      'Are you sure you want to save?'
    )
      .subscribe((res) => {

        if (res !== 'confirm') {
          return;
        }

        this.showProcessingState();

        const payload = this.preparePayload();

        const request$ = this.isEditMode
          ? this.consumerModalService.updateConsumerApplication(
            payload,
            this.payload.consumerUuid
          )
          : this.consumerModalService.addConsumerApplication(
            payload
          );

        this.handleRequest(request$, 'Saved successfully.');
      });
  }


  onDelete(): void {

    this.openConfirmationModal(
      'Delete',
      'Are you sure you want to delete?'
    )
      .subscribe((res) => {

        if (res !== 'confirm') {
          return;
        }

        this.showProcessingState();

        const request$ =
          this.consumerModalService.deleteConsumerApplication(
            this.payload.consumerUuid
          );

        this.handleRequest(
          request$,
          'Deleted successfully.'
        );
      });
  }

  private handleRequest(
    request$: any,
    successMessage: string
  ): void {

    request$.subscribe({

      next: () => {

        this.modalService.update({
          title: 'Success!',
          body: successMessage,
          icon: 'check_circle',
          theme: 'success',
          loading: false,
          autoClose: 1500,
          showCancel: false
        });

        setTimeout(() => {
          this.closeModal(true);
        }, 1600);
      },

      error: () => {

        this.modalService.update({
          title: 'Error',
          body: 'Request failed.',
          theme: 'warning',
          loading: false,
          autoClose: 1500,
          showCancel: false
        });
      }
    });
  }


  private openConfirmationModal(
    title: string,
    body: string
  ) {

    return this.modalService
      .open({
        title,
        body,
        icon: 'warning',
        theme: 'warning',
        showConfirm: true,
        showCancel: true
      })
      .pipe(first());
  }

  private showProcessingState(): void {

    this.modalService.update({
      title: 'Processing...',
      loading: true,
      showConfirm: false
    });
  }


  closeModal(result: boolean = false): void {

    this.payload = this.createEmptyPayload();

    this.isEditMode = false;

    this.consumerModalService.close(result);
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