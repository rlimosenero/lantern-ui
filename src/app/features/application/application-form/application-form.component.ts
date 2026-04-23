import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from '../../../shared/components/breadcrumbs/breadcrumbs.service';
import { ApplicationApiService } from '../services/application-api.service';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { ModalService } from '../../../shared/components/confirmation-modal/modal.service';
import { CommonModule } from '@angular/common';

type TechStackKey = 'techStackApp' | 'techStackPlatform' | 'techStackStorage' | 'techStackSecurity';

@Component({
  selector: 'app-application-form',
  imports: [
    MatCardModule,
    ButtonComponent,
    FormsModule,
    MultiSelectComponent,
    CommonModule
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
})
export class ApplicationFormComponent implements OnInit {
  isEditMode = false;
  initialSnapshot: any;

  dropdownOptions: any = [];

  appName = '';
  desc = '';
  ownerName = '';
  ownerDept = '';
  serviceType = '';
  lifecycleStatus = '';
  bauSupportName = '';
  bauSupportDept = '';
  repoUrl = '';
  swaggerUrl = '';
  docsUrl = '';
  techStackPlatform = '';
  techStackApp = '';
  techStackStorage = '';
  techStackSecurity = '';
  techStackMessage = '';


  constructor(
    private route: ActivatedRoute,
    private applicationApiService: ApplicationApiService,
    private breadcrumbService: BreadcrumbService,
    private modalService: ModalService,
    private router: Router
  ) { }


  ngOnInit() {
    this.fetchDropdownOptions('APPLICATION_DETAILS');

    const url = this.route.snapshot.url.map(s => s.path);
    const id = this.route.snapshot.paramMap.get('id');

    this.isEditMode = url.includes('edit') && !!id;

    if (this.isEditMode && id) {
      this.fetchAppDetails(id);
    }
  }

  fetchAppDetails(appUuid: string) {
    this.applicationApiService.getAppDetails(appUuid).subscribe({
      next: (data: any) => {
        let res = data.data;

        this.breadcrumbService.setOverride(
          `/application/details/${appUuid}`,
          res.appName
        );

        this.appName = res.appName;
        this.desc = res.appDesc;
        this.ownerName = res.ownerName;
        this.ownerDept = res.ownerDept;
        this.serviceType = res.serviceType;
        this.lifecycleStatus = res.lifecycleStatus;
        this.bauSupportName = res.bauSupportName;
        this.bauSupportDept = res.bauSupportDept;
        this.repoUrl = res.repoUrl;
        this.swaggerUrl = res.swaggerUrl;
        this.docsUrl = res.docsUrl;
        this.techStackPlatform = res.techStackPlatform;
        this.techStackApp = res.techStackApp;
        this.techStackStorage = res.techStackStorage;
        this.techStackSecurity = res.techStackSecurity;
        this.techStackMessage = res.techStackMessage;

        this.initialSnapshot = JSON.stringify({
          appName: this.appName,
          desc: this.desc,
          ownerName: this.ownerName,
          ownerDept: this.ownerDept,
          serviceType: this.serviceType,
          lifecycleStatus: this.lifecycleStatus,
          bauSupportName: this.bauSupportName,
          bauSupportDept: this.bauSupportDept,
          repoUrl: this.repoUrl,
          swaggerUrl: this.swaggerUrl,
          docsUrl: this.docsUrl,
          techStackPlatform: this.techStackPlatform,
          techStackApp: this.techStackApp,
          techStackStorage: this.techStackStorage,
          techStackSecurity: this.techStackSecurity,
          techStackMessage: this.techStackMessage
        });

      },
      error: (err: any) => {
        console.log('Error: ' + err);
      }
    })
  }

  fetchDropdownOptions(groupName: string) {
    this.applicationApiService.getDropdownOptions(groupName).subscribe({
      next: (data: any) => {
        this.dropdownOptions = data.data

      },
      error: (err: any) => {
        console.log('Error: ' + err);
      }
    })
  }

  onTechStackChange(event: any[], key: TechStackKey) {
    const formattedValue = event.map((item: any) => item.value).join(', ');

    this[key] = formattedValue;
  }

  onSave() {
    const id = this.route.snapshot.paramMap.get('id');

    const payload = {
      appUuid: id,
      appName: this.appName,
      appDesc: this.desc,
      serviceType: this.serviceType,
      lifecycleStatus: this.lifecycleStatus,
      ownerName: this.ownerName,
      ownerDept: this.ownerDept,
      bauSupportName: this.bauSupportName,
      bauSupportDept: this.bauSupportDept,
      repoUrl: this.repoUrl,
      swaggerUrl: this.swaggerUrl,
      docsUrl: this.docsUrl,
      techStackPlatform: this.techStackPlatform,
      techStackApp: this.techStackApp,
      techStackStorage: this.techStackStorage,
      techStackSecurity: this.techStackSecurity,
      techStackMessage: this.techStackMessage || '',

    };

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

        if (this.isEditMode && id) {
          this.applicationApiService.updateAppDetails(id, payload).subscribe({
            next: (res) => {
              localStorage.removeItem('app_search_state');
              this.modalService.update({
                title: 'Success!',
                body: 'Application successfully updated.',
                icon: 'check_circle',
                theme: 'success',
                loading: false,
                autoClose: 1500
              });
              setTimeout(() => {
                this.router.navigate([`/application/details/${id}`])
              }, 1600);
            },
            error: (err) => {
              console.error('Update Error:', err);
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
        } else {

          this.applicationApiService.addAppDetails(payload).subscribe({
            next: (res) => {
              localStorage.removeItem('app_search_state');
              this.modalService.update({
                title: 'Success!',
                body: 'Application successfully saved.',
                icon: 'check_circle',
                theme: 'success',
                loading: false,
                autoClose: 1500
              });
              setTimeout(() => {
                this.router.navigate([`/application`])
              }, 1600);
            },
            error: (err) => {
              console.error('Update Error:', err);
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
        }

      }

    });
  }

  hasChanges(): boolean {
    const current = JSON.stringify({
      appName: this.appName,
      desc: this.desc,
      ownerName: this.ownerName,
      ownerDept: this.ownerDept,
      serviceType: this.serviceType,
      lifecycleStatus: this.lifecycleStatus,
      bauSupportName: this.bauSupportName,
      bauSupportDept: this.bauSupportDept,
      repoUrl: this.repoUrl,
      swaggerUrl: this.swaggerUrl,
      docsUrl: this.docsUrl,
      techStackPlatform: this.techStackPlatform,
      techStackApp: this.techStackApp,
      techStackStorage: this.techStackStorage,
      techStackSecurity: this.techStackSecurity,
      techStackMessage: this.techStackMessage
    });

    return current !== this.initialSnapshot;
  }

  isSaveDisabled(form: any): boolean {
    if (!form.valid) return true;

    if (this.isEditMode) {
      return !this.hasChanges();
    }

    return false;
  }

}
