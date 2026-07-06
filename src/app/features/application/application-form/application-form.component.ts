import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MultiSelectComponent } from '../../../shared/components/multi-select/multi-select.component';
import { ModalService } from '../../../shared/components/confirmation-modal/modal.service';
import { BreadcrumbService } from '../../../shared/components/breadcrumbs/breadcrumbs.service';
import { ApplicationApiService } from '../services/application-api.service';

type TechStackKey =
  | 'techStackApp'
  | 'techStackPlatform'
  | 'techStackStorage'
  | 'techStackSecurity';

@Component({
  selector: 'app-application-form',
  imports: [
    MatCardModule,
    ButtonComponent,
    FormsModule,
    MultiSelectComponent,
    CommonModule
  ],
  templateUrl:
    './application-form.component.html',

  styleUrl:
    './application-form.component.scss',
})
export class ApplicationFormComponent implements OnInit {
  isEditMode = false;
  initialSnapshot = '';
  dropdownOptions: any = {};
  validations: any = {};

  payload: any = this.createInitialPayload();

  constructor(
    private route: ActivatedRoute,
    private applicationApiService: ApplicationApiService,
    private breadcrumbService: BreadcrumbService,
    private modalService: ModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeComponent();
  }

  initializeComponent(): void {
    this.fetchDropdownOptions();
    this.initializeValidations();

    const id = this.getIdFromUrl();

    const urlSegments =
      this.route.snapshot.url.map(
        segment => segment.path
      );

    this.isEditMode = urlSegments.includes('edit') && !!id;

    if (this.isEditMode && id) {

      this.fetchAppDetails(id);
      return;

    }

    this.takeSnapshot();

  }

  createInitialPayload() {

    return {

      appName: '',
      desc: '',

      ownerName: '',
      ownerDept: '',

      serviceType: '',
      lifecycleStatus: '',

      bauSupportName: '',
      bauSupportDept: '',

      repoUrl: '',
      swaggerUrl: '',
      docsUrl: '',

      techStackPlatform: '',
      techStackApp: '',
      techStackStorage: '',
      techStackSecurity: '',
      techStackMessage: ''

    };

  }

  getIdFromUrl(): string {

    return (
      this.route
        .snapshot
        .paramMap
        .get('id') || ''
    );

  }

  takeSnapshot(): void {
    this.initialSnapshot = JSON.stringify(this.payload);

  }

  hasChanges(): boolean {
    return (
      JSON.stringify(this.payload) !==
      this.initialSnapshot
    );

  }

  // isSaveDisabled(form: any): boolean {
  //   if (!form.valid) {
  //     return true;
  //   }

  //   return this.isEditMode
  //     ? !this.hasChanges()
  //     : false;

  // }

  isSaveDisabled(form: any): boolean {

    if (!form.valid) {
      return true;
    }

    const techStackFields = [
      'techStackPlatform',
      'techStackApp',
      'techStackStorage',
      'techStackSecurity'
    ];

    const invalidTechStack =
      techStackFields.some(
        field => !this.isTechStackValid(field)
      );

    if (invalidTechStack) {
      return true;
    }

    return this.isEditMode
      ? !this.hasChanges()
      : false;
  }

  clearSearchState(): void {
    localStorage.removeItem('app_search_state');

  }

  fetchDropdownOptions(): void {

    this.applicationApiService
      .getDropdownOptions('APPLICATION_DETAILS')
      .pipe(first())
      .subscribe({

        next: (res: any) => {
          this.dropdownOptions = { ...res.data };

        },

        error: (err: any) => {
          console.error('Dropdown Error:', err);

        }

      });

  }

  fetchAppDetails(
    appUuid: string
  ): void {

    this.applicationApiService
      .getAppDetails(appUuid)
      .pipe(first())
      .subscribe({

        next: (res: any) => {

          const data =
            res.data;

          this.breadcrumbService
            .setOverride(
              `/application/details/${appUuid}`,
              data.appName
            );

          this.payload = {

            ...this.payload,

            appName: data.appName,
            desc: data.appDesc,
            ownerName: data.ownerName,
            ownerDept: data.ownerDept,
            serviceType: data.serviceType,
            lifecycleStatus: data.lifecycleStatus,
            bauSupportName: data.bauSupportName,
            bauSupportDept: data.bauSupportDept,
            repoUrl: data.repoUrl,
            swaggerUrl: data.swaggerUrl,
            docsUrl: data.docsUrl,
            techStackPlatform: data.techStackPlatform,
            techStackApp: data.techStackApp,
            techStackStorage: data.techStackStorage,
            techStackSecurity: data.techStackSecurity,
            techStackMessage: data.techStackMessage

          };

          this.takeSnapshot();

        },

        error: (err: any) => {

          console.error(
            'Application Details Error:',
            err
          );

        }

      });

  }

  onTechStackChange(
    event: any[],
    key: TechStackKey
  ): void {

    this.payload[key] =
      event
        .map(
          (item: any) => item.value
        )
        .join(', ');

  }

  onCancel(): void {

    const id =
      this.getIdFromUrl();

    const route =
      this.isEditMode
        ? `/application/details/${id}`
        : '/application';

    this.router.navigate([route]);

  }

  buildPayload(): any {

    return {

      appUuid: this.getIdFromUrl(),
      appName: this.payload.appName,
      appDesc: this.payload.desc,
      serviceType: this.payload.serviceType,
      lifecycleStatus: this.payload.lifecycleStatus,

      ownerName: this.payload.ownerName,
      ownerDept: this.payload.ownerDept,
      bauSupportName: this.payload.bauSupportName,
      bauSupportDept: this.payload.bauSupportDept,

      repoUrl: this.payload.repoUrl,
      swaggerUrl: this.payload.swaggerUrl,
      docsUrl: this.payload.docsUrl,

      techStackPlatform: this.payload.techStackPlatform,
      techStackApp: this.payload.techStackApp,
      techStackStorage: this.payload.techStackStorage,
      techStackSecurity: this.payload.techStackSecurity,
      techStackMessage: this.payload.techStackMessage || ''

    };

  }

  onSave(): void {

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
      .subscribe(result => {

        if (result !== 'confirm') {
          return;

        }

        this.showProcessingModal();

        const id = this.getIdFromUrl();
        const payload = this.buildPayload();

        const request$ =
          this.isEditMode
            ? this.applicationApiService
              .updateAppDetails(
                id,
                payload
              )
            : this.applicationApiService
              .addAppDetails(
                payload
              );

        request$
          .pipe(first())
          .subscribe({

            next: () => {

              this.clearSearchState();

              this.showSuccessModal(
                this.isEditMode
                  ? 'Application successfully updated.'
                  : 'Application successfully saved.'
              );

              setTimeout(() => {

                this.payload = this.createInitialPayload();

                this.takeSnapshot();

                const route =
                  this.isEditMode
                    ? `/application/details/${id}`
                    : '/application';

                this.router.navigate([
                  route
                ]);

              }, 1600);

            },

            error: (err: any) => {

              console.error(
                'Save Error:',
                err
              );

              this.showErrorModal();

            }

          });

      });

  }

  deleteApplication(): void {

    const id = this.getIdFromUrl();

    if (!this.isEditMode || !id) {
      return;

    }

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
      .subscribe(result => {

        if (result !== 'confirm') {
          return;

        }

        this.showProcessingModal();

        this.applicationApiService
          .deleteAppDetails(id)
          .pipe(first())
          .subscribe({

            next: () => {

              this.clearSearchState();

              this.showSuccessModal(
                'Application successfully deleted.'
              );

              setTimeout(() => {

                this.payload =
                  this.createInitialPayload();

                this.takeSnapshot();

                this.router.navigate([
                  '/application'
                ]);

              }, 1600);

            },

            error: (err: any) => {

              console.error(
                'Delete Error:',
                err
              );

              this.showErrorModal();

            }

          });

      });

  }

  showProcessingModal(): void {

    this.modalService.update({

      title: 'Processing...',
      body: 'Please wait...',
      loading: true,
      showConfirm: false,
      showCancel: false

    });

  }

  showSuccessModal(body: string): void {

    this.modalService.update({

      title: 'Success!', body,
      icon: 'check_circle',
      theme: 'success',
      loading: false,
      autoClose: 1500

    });

  }

  showErrorModal(): void {
    this.modalService.update({
      title: 'Error',
      body: 'Something went wrong.',
      icon: 'error',
      theme: 'warning',
      loading: false,
      autoClose: 1500

    });

  }

  initializeValidations(): void {
    this.applicationApiService
      .getValidationProperties()
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          this.validations = res.data;
        },
        error: (err) => {
          console.error('Validation Error:', err);
        }
      });
  }

  getRule(field: string, rule: string): any {
    return this.validations?.[field]?.[rule];
  }

  hasError(control: any, error: string): boolean {
    return !!control?.touched && !!control?.errors?.[error];
  }

  isFieldRequired(field: string): boolean {
    return !!this.getRule(field, 'required');
  }

  isTechStackValid(field: string): boolean {
    const required = this.isFieldRequired(field);

    if (!required) {
      return true;
    }

    return !!this.payload[field]?.trim();
  }


}