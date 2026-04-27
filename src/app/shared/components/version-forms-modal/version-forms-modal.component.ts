import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
import { ApplicationApiService } from '../../../features/application/services/application-api.service';
import { VersionFormsModalService } from './version-forms-modal.service';
import { ModalService } from '../confirmation-modal/modal.service';

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
  initialSnapshot = '';
  dropdownOptions: any = {};

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
    this.isEditMode = !!this.data?.details;

    if (this.isEditMode && this.data.details) {
      this.mapDetailstoData(this.data.details);
    }

    if (this.data?.appInfo) {
      this.payload.appUuid = this.data.appInfo.appUuid;
      this.payload.appName = this.data.appInfo.appName;
    }

    this.fetchDropdownOptions('VERSION_FORMS');
    this.takeSnapshot();
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
        this.dropdownOptions = res.data;
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
    }).subscribe(res => {

      if (res === 'confirm') {
        this.modalService.update({
          title: 'Processing...',
          body: 'Please wait...',
          loading: true,
          showConfirm: false,
          showCancel: false
        });

        if (this.isEditMode) {
          this.versionFormsService.updateApplicationVersion(this.payload, this.payload.appVersionUuid).subscribe({
            next: () => {
              this.modalService.update({
                title: 'Success!',
                body: 'Version updated.',
                icon: 'check_circle',
                theme: 'success',
                loading: false,
                autoClose: 1500
              });

              setTimeout(() => this.close.emit(true), 1600);
            },
            error: () => {
              this.modalService.update({
                title: 'Error',
                body: 'Something went wrong.',
                icon: 'error',
                theme: 'warning',
                loading: false,
                autoClose: 1500
              });
            }
          })
        } else {
          this.versionFormsService.addApplicationVersion(this.payload).subscribe({
            next: () => {
              localStorage.removeItem('app_search_state');
              this.modalService.update({
                title: 'Success!',
                body: 'Version successfully added.',
                icon: 'check_circle',
                theme: 'success',
                loading: false,
                autoClose: 1500
              });

              setTimeout(() => this.close.emit(true), 1600);
            },
            error: () => {
              this.modalService.update({
                title: 'Error',
                body: 'Something went wrong.',
                icon: 'error',
                theme: 'warning',
                loading: false,
                autoClose: 1500
              });
            }
          });
        }
      }
    });
  }

  onCancel() {
    this.close.emit(null);
  }

  mapDetailstoData(data: any) {
    this.payload.appVersionUuid = data.appVersionUuid;
    this.payload.appUuid = data.appUuid;
    this.payload.appName = data.appName;
    this.payload.appVersion = data.appVersion;
    this.payload.releaseStage = data.releaseStage;
    this.payload.environment = data.environment;
    this.payload.buildVersion = data.buildVersion;
    this.payload.features = data.features;
    this.payload.developers = data.developers;
    this.payload.devSquad = data.squadName;
    this.payload.docsUrl = data.docsUrl;
  }
}