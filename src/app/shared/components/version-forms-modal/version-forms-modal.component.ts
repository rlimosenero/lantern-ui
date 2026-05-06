import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { ApplicationApiService } from '../../../features/application/services/application-api.service';
import { VersionFormsModalService } from './version-forms-modal.service';
import { ModalService } from '../confirmation-modal/modal.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-version-forms-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent
  ],
  templateUrl: './version-forms-modal.component.html',
  styleUrl: './version-forms-modal.component.scss',
})
export class VersionFormsModalComponent implements OnInit {

  @Input() data: any;
  @Output() close = new EventEmitter<any>();

  isEditMode = false;
  versionType: 'APP' | 'API' = 'APP';
  initialSnapshot = '';
  dropdownOptions: any = {};
  selectedAppVersionObj: any = null;

  payload: any = {
    appVersionUuid: null,
    appUuid: null,
    appName: '',
    appVersion: '',
    releaseStage: '',
    environment: '',
    buildVersion: '',
    features: '',
    developers: '',
    devSquad: '',
    docsUrl: ''
  };

  constructor(
    private applicationApiService: ApplicationApiService,
    private versionFormsService: VersionFormsModalService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.versionType = this.data?.versionType || 'APP';
    this.isEditMode = !!this.data?.details;

    if (this.isEditMode && this.data.details) {
      this.mapDetailstoData(this.data.details);
    }

    this.initializeData();

    this.fetchDropdownOptions('VERSION_FORMS');
    this.takeSnapshot();
  }

  initializeData() {
    if (this.data?.appInfo) {
      if (this.versionType === 'APP') {
        this.payload.appUuid = this.data.appInfo.appUuid;
        this.payload.appName = this.data.appInfo.appName;
      } else {
        this.payload.appApiUuid = this.data.appInfo.appApiUuid;
        this.payload.appUuid = this.data.appInfo.appUuid;

        this.loadAppVersionOptions();
      }
    }
  }

  loadAppVersionOptions() {
    if (!this.payload.appUuid) return;

    this.applicationApiService.getVersionHistoryList(this.payload.appUuid, 0, 1000)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          if (res?.data?.results) {
            this.dropdownOptions['APP_VERSIONS'] = res.data.results.map((item: any) => ({
              version: item.appVersion,
              uuid: item.appVersionUuid
            }));

            if (this.isEditMode && this.payload.appVersionUuid) {
              this.selectedAppVersionObj =
                this.dropdownOptions['APP_VERSIONS'].find(
                  (opt: any) => {
                    return opt.version === this.payload.appVersion;
                  }
                ) || null;
            }
          }
        },
        error: (err) => console.error('Error loading app versions:', err)
      });
  }

  onAppVersionChange(selected: any) {
    this.selectedAppVersionObj = selected;

    if (selected) {
      this.payload.appVersion = selected.version;
      this.payload.appVersionUuid = selected.uuid;
    } else {
      this.payload.appVersion = '';
      this.payload.appVersionUuid = null;
    }
  }

  takeSnapshot() {
    this.initialSnapshot = JSON.stringify(this.payload);
  }

  hasChanges(): boolean {
    return JSON.stringify(this.payload) !== this.initialSnapshot;
  }

  fetchDropdownOptions(groupName: string) {
    this.applicationApiService.getDropdownOptions(groupName).subscribe({
      next: (res: any) => {
        this.dropdownOptions = { ...this.dropdownOptions, ...res.data };
      },
      error: (err: any) => console.error('Error fetching dropdowns:', err)
    });
  }

  isSaveDisabled(form: any): boolean {
    if (!form.valid) return true;
    if (this.isEditMode) return !this.hasChanges();
    return false;
  }

  onSave() {
    this.modalService.open({
      title: 'Save',
      body: 'Are you sure you want to save?',
      icon: 'warning',
      theme: 'warning',
      showConfirm: true,
      showCancel: true
    }).pipe(first()).subscribe(res => {

      if (res === 'confirm') {
        this.modalService.update({ title: 'Processing...', loading: true, showConfirm: false });

        const finalPayload = this.preparePayload();

        this.getSaveObservable(finalPayload).subscribe({
          next: () => {
            if (!this.isEditMode) localStorage.removeItem('app_search_state');
            this.modalService.update({
              title: 'Success!', body: 'Saved successfully.', icon: 'check_circle',
              theme: 'success', loading: false, autoClose: 1500, showCancel: false
            });
            setTimeout(() => this.close.emit('confirm'), 1600);
          },
          error: () => {
            this.modalService.update({ title: 'Error', body: 'Request failed.', theme: 'warning', loading: false, autoClose: 1500 });
          }
        });
      }
    });
  }

  onCancel() {
    this.close.emit('close');
  }

  mapDetailstoData(data: any) {
    this.payload = { ...this.payload, ...data };

    this.payload.devSquad = data.devSquad || data.squadName || '';

    this.payload.appVersionUuid = data.appVersionUuid;
    this.payload.apiVersionUuid = data.apiVersionUuid;

    if (this.versionType === 'API' && this.payload.appVersion) {
      this.selectedAppVersionObj = {
        version: this.payload.appVersion,
        uuid: this.payload.appVersionUuid
      };
    }
  }

  private getSaveObservable(cleanPayload: any) {
    if (this.versionType === 'API') {
      return this.isEditMode
        ? this.versionFormsService.updateApiVersion(cleanPayload, cleanPayload.apiVersionUuid)
        : this.versionFormsService.addApiVersion(cleanPayload);
    } else {
      return this.isEditMode
        ? this.versionFormsService.updateApplicationVersion(cleanPayload, cleanPayload.appVersionUuid)
        : this.versionFormsService.addApplicationVersion(cleanPayload);
    }
  }

  preparePayload() {
    // Shared fields for both payloads
    const commonFields = {
      appVersion: this.payload.appVersion,
      buildVersion: this.payload.buildVersion,
      releaseStage: this.payload.releaseStage,
      environment: this.payload.environment,
      features: this.payload.features,
      developers: this.payload.developers,
      devSquad: this.payload.devSquad,
      docsUrl: this.payload.docsUrl
    };

    if (this.versionType === 'API') {
      return {
        ...commonFields,
        apiVersionUuid: this.payload.apiVersionUuid,
        appVersionUuid: this.payload.appVersionUuid,
        appApiUuid: this.payload.appApiUuid,
        apiVersion: this.payload.apiVersion
      };
    } else {
      return {
        ...commonFields,
        appVersionUuid: this.payload.appVersionUuid,
        appUuid: this.payload.appUuid,
        appName: this.payload.appName
      };
    }
  }



}