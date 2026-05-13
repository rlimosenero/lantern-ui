import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    ]
  };

  payload: any = {
    appApiUuid: null,
    appUuid: null,
    appName: '',
    description: '',
    relationship: '',
    businessOwner: '',
    technicalOwner: '',
    networkMode: '',
    tokenExpiry: ''
  };

  constructor(
    private modalService: ModalService,
    private upstreamModalService: UpstreamAppFormsModalService
  ) {

    this.upstreamModalService.getState().subscribe((cfg: any) => {

      this.isOpen = !!cfg;

      if (!cfg) return;

      this.isEditMode = !!cfg.details;

      this.payload.appApiUuid = cfg.appApiUuid;
      this.payload.appUuid = cfg.appUuid

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
      appUuid: this.payload.appUuid,
      appName: this.payload.appName,
      description: this.payload.description,
      relationship: this.payload.relationship,
      businessOwner: this.payload.appOwner,
      technicalOwner: this.payload.techOwner,
      networkMode: this.payload.networkMode,
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
          ? this.upstreamModalService.updateUpstreamApplication(
            payload,
            this.payload.upstreamAppUuid
          )
          : this.upstreamModalService.addUpstreamApplication(payload);

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
      appApiUuid: null,
      appUuid: null,
      appName: '',
      description: '',
      relationship: '',
      businessOwner: '',
      technicalOwner: '',
      networkMode: '',
      tokenExpiry: ''
    };

    this.isEditMode = false;

    this.upstreamModalService.close(result);
  }
}