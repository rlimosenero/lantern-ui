import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { first } from 'rxjs';

import { ButtonComponent } from '../button/button.component';
import { ModalService } from '../confirmation-modal/modal.service';
import { ApplicationApiService } from '../../../features/application/services/application-api.service';
import { VersionFormsModalService } from './version-forms-modal.service';
import { DatepickerComponent } from '../datepicker/datepicker.component';

@Component({
  selector: 'app-version-forms-modal',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    DatepickerComponent
  ],
  templateUrl: './version-forms-modal.component.html',
  styleUrl: './version-forms-modal.component.scss'
})
export class VersionFormsModalComponent {
  validations: any = {};
  isOpen = false;
  isEditMode = false;

  versionType: 'APP' | 'API' = 'APP';

  initialSnapshot = '';

  dropdownOptions: any = {};

  selectedAppVersionObj: any = null;

  payload: any = {
    appVersionUuid: null,
    apiVersionUuid: null,
    appUuid: null,
    appApiUuid: null,

    appName: '',
    appVersion: '',
    apiVersion: '',

    releaseStage: '',
    environment: '',

    buildVersion: '',
    features: '',
    developers: '',
    devSquad: '',
    docsUrl: '',
    modifiedDateTime: ''
  };

  constructor(
    private modalService: ModalService,
    private versionService: VersionFormsModalService,
    private applicationApiService: ApplicationApiService
  ) {

    this.versionService.getState().subscribe(cfg => {

      this.isOpen = !!cfg;

      if (!cfg) return;

      this.resetPayload();

      this.versionType = cfg.versionType ?? 'APP';

      this.isEditMode = !!cfg.details;

      if (cfg.appInfo) {

        this.payload.appUuid = cfg.appInfo.appUuid;
        this.payload.appApiUuid = cfg.appInfo.appApiUuid;
        this.payload.appName = cfg.appInfo.appName;
      }

      if (cfg.details) {
        console.log(cfg)

        this.mapDetails(cfg.details);
      } else {
        this.payload.modifiedDateTime = this.formatDate(new Date());
      }

      this.fetchDropdownOptions();
      this.initializeValidations();

      if (this.versionType === 'API') {
        this.loadAppVersions();
      }

      this.takeSnapshot();

    });

  }

  initializeVersionDropdown() {

    if (!this.isEditMode) return;

    const selected =
      this.dropdownOptions.APP_VERSIONS?.find(
        (item: any) =>
          item.uuid === this.payload.appVersionUuid
      );

    if (!selected) return;

    this.selectedAppVersionObj = selected;

    this.onAppVersionChange(selected);

  }

  loadAppVersions() {

    if (!this.payload.appUuid) return;

    this.applicationApiService
      .getVersionHistoryList(
        this.payload.appUuid,
        0,
        1000
      )
      .pipe(first())
      .subscribe((res: any) => {

        this.dropdownOptions.APP_VERSIONS =
          res?.data?.results?.map(
            (x: any) => ({
              version: x.appVersion,
              uuid: x.appVersionUuid
            })
          ) || [];

        this.initializeVersionDropdown();

      });

  }

  onAppVersionChange(selected: any) {
    this.selectedAppVersionObj = selected;
    this.payload.appVersion = selected?.version || '';
    this.payload.appVersionUuid = selected?.uuid || null;

  }

  fetchDropdownOptions() {

    this.applicationApiService
      .getDropdownOptions('VERSION_FORMS')
      .pipe(first())
      .subscribe((res: any) => {

        this.dropdownOptions = {
          ...this.dropdownOptions,
          ...res.data
        };

      });

  }

  mapDetails(data: any) {

    this.payload = {
      ...this.payload,
      ...data
    };

    this.payload.devSquad =
      data.devSquad ||
      data.squadName ||
      '';

    this.payload.modifiedDateTime =
      data.modifiedDateTime
        ? this.formatDate(data.modifiedDateTime)
        : '';

  }

  takeSnapshot() {
    this.initialSnapshot =
      JSON.stringify(this.payload);
  }

  hasChanges() {

    return JSON.stringify(
      this.payload
    ) !== this.initialSnapshot;

  }

  isSaveDisabled(form: any) {

    if (!form.valid) {
      return true;
    }

    return this.isEditMode
      ? !this.hasChanges()
      : false;

  }

  onSave() {

    this.modalService
      .open({
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

        const payload: any = this.preparePayload();

        const request$ =
          this.versionType === 'API'
            ? this.isEditMode
              ? this.versionService.updateApiVersion(payload, payload.apiVersionUuid)
              : this.versionService.addApiVersion(payload)

            : this.isEditMode
              ? this.versionService.updateApplicationVersion(payload, payload.appVersionUuid)
              : this.versionService.addApplicationVersion(payload);


        request$.subscribe({

          next: () => {

            this.modalService.update({

              title: 'Success!',
              body: 'Saved successfully',
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
              body: 'Request failed',
              theme: 'warning',
              loading: false,
              autoClose: 1500

            });

          }

        });

      });

  }

  onDelete() {

    this.modalService
      .open({
        title: 'Delete',
        body: 'Are you sure you want to delete?',
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

        const request$ =
          this.versionType === 'API'
            ? this.versionService.deleteApiVersion(this.payload.apiVersionUuid)
            : this.versionService.deleteApplicationVersion(this.payload.appVersionUuid);

        request$.subscribe({

          next: () => {

            this.modalService.update({

              title: 'Success!',
              body: 'Deleted successfully.',
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
              body: 'Delete request failed.',
              theme: 'warning',
              loading: false,
              autoClose: 1500

            });

          }

        });

      });

  }

  preparePayload() {

    const common = {

      buildVersion: this.payload.buildVersion,
      releaseStage: this.payload.releaseStage,
      environment: this.payload.environment,
      features: this.payload.features,
      developers: this.payload.developers,
      devSquad: this.payload.devSquad,
      docsUrl: this.payload.docsUrl,
      modifiedDateTime: this.payload.modifiedDateTime + 'T00:00:00.000Z'

    };

    return this.versionType === 'API'
      ? {

        ...common,

        apiVersionUuid: this.payload.apiVersionUuid,
        appVersionUuid: this.payload.appVersionUuid,
        appApiUuid: this.payload.appApiUuid,
        apiVersion: this.payload.apiVersion,
        appVersion: this.payload.appVersion

      }

      : {

        ...common,

        appVersionUuid: this.payload.appVersionUuid,
        appUuid: this.payload.appUuid,
        appName: this.payload.appName,
        appVersion: this.payload.appVersion

      };

  }

  resetPayload() {

    this.payload = {

      appVersionUuid: null,
      apiVersionUuid: null,
      appUuid: null,
      appApiUuid: null,

      appName: '',
      appVersion: '',
      apiVersion: '',

      releaseStage: '',
      environment: '',

      buildVersion: '',
      features: '',
      developers: '',
      devSquad: '',
      docsUrl: '',
      modifiedDateTime: ''

    };

  }

  closeModal(result = false) {
    this.resetPayload();
    this.selectedAppVersionObj = null;
    this.isEditMode = false;
    this.versionService.close(result);

  }

  formatDate(date: string | Date): string {

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  initializeValidations(): void {
    let validationRequest$;

    switch (this.versionType) {
      case 'API':
        validationRequest$ = this.versionService.getApplicationApiVersionValidationProperties();
        break;

      case 'APP':
        validationRequest$ = this.versionService.getApplicationVersionValidationProperties();
        break;

      default:
        console.warn(`Unknown version type: ${this.versionType}`);
        return;
    }

    validationRequest$
      .pipe(first())
      .subscribe({
        next: ({ data }: any) => {
          this.validations = data;
        },
        error: (err) => {
          console.error('Validation Error:', err);
        }
      });

  }

}