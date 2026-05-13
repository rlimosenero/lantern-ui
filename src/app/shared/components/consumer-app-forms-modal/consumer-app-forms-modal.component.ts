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

  dropdowns = {
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

  payload: any = {
    consumerAppUuid: null,
    appApiUuid: null,
    appName: '',
    description: '',
    relationship: '',
    businessOwner: '',
    technicalOwner: '',
    trigger: '',
    appType: '',
    networkMode: '',
    dateOnboarded: '',
    status: '',
    tokenExpiry: ''
  };

  constructor(
    private modalService: ModalService,
    private consumerModalService: ConsumerAppFormsModalService
  ) {

    this.consumerModalService.getState().subscribe((cfg: any) => {

      this.isOpen = !!cfg;

      if (!cfg) return;

      this.isEditMode = !!cfg.details;

      this.payload.appApiUuid = cfg.appApiUuid;

      if (cfg.details) {
        this.mapDetails(cfg.details);
      }

      this.takeSnapshot();
    });
  }

  mapDetails(data: any) {

    this.payload = {
      ...this.payload,
      ...data,

      dateOnboarded: data.dateOnboarded || '',
      tokenExpiry: data.tokenExpiry || ''
    };
  }

  takeSnapshot() {
    this.initialSnapshot = JSON.stringify(this.payload);
  }

  hasChanges(): boolean {
    return JSON.stringify(this.payload) !== this.initialSnapshot;
  }

  isSaveDisabled(form: any): boolean {

    if (!form.valid) return true;

    if (this.isEditMode) {
      return !this.hasChanges();
    }

    return false;
  }

  preparePayload() {

    return {
      appApiUuid: this.payload.appApiUuid,
      appName: this.payload.appName,
      description: this.payload.description,
      relationship: this.payload.relationship,
      businessOwner: this.payload.businessOwner,
      technicalOwner: this.payload.technicalOwner,
      trigger: this.payload.trigger,
      appType: this.payload.appType,
      networkMode: this.payload.networkMode,
      dateOnboarded: this.payload.dateOnboarded || null,
      status: this.payload.status,
      tokenExpiry: this.payload.tokenExpiry || null
    };
  }

  onSave() {

    this.modalService.open({
      title: 'Save',
      body: 'Are you sure you want to save?',
      icon: 'warning',
      theme: 'warning',
      showConfirm: true,
      showCancel: true
    })
      .pipe(first())
      .subscribe(res => {

        if (res !== 'confirm') return;

        this.modalService.update({
          title: 'Processing...',
          loading: true,
          showConfirm: false
        });

        const payload = this.preparePayload();

        const request$ = this.isEditMode
          ? this.consumerModalService.updateConsumerApplication(
            payload,
            this.payload.consumerAppUuid
          )
          : this.consumerModalService.addConsumerApplication(payload);

        request$.subscribe({
          next: () => {

            this.modalService.update({
              title: 'Success!',
              body: 'Saved successfully.',
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
              autoClose: 1500
            });
          }
        });

      });
  }

  closeModal(result: boolean = false) {

    this.payload = {
      consumerAppUuid: null,
      appApiUuid: null,
      appName: '',
      description: '',
      relationship: '',
      businessOwner: '',
      technicalOwner: '',
      trigger: '',
      appType: '',
      networkMode: '',
      dateOnboarded: '',
      status: '',
      tokenExpiry: ''
    };

    this.isEditMode = false;

    this.consumerModalService.close(result);
  }
}
