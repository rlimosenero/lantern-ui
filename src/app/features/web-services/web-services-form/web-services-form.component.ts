import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { first } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationApiService } from '../../application/services/application-api.service';
import { ModalService } from '../../../shared/components/confirmation-modal/modal.service';
import { WebServicesApiService } from '../services/web-services-api.service';

@Component({
  selector: 'app-web-services-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    ButtonComponent
  ],
  templateUrl: './web-services-form.component.html',
  styleUrl: './web-services-form.component.scss',
})
export class WebServicesFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  isEditMode = false;
  initialSnapshot = '';
  dropdownOptions: any = {};
  validations: any = {};

  payload: any = this.createInitialPayload();

  constructor(
    private applicationApiService: ApplicationApiService,
    private webServiceApiService: WebServicesApiService,
    private modalService: ModalService,
    private router: Router,
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

    this.isEditMode =
      urlSegments.includes('edit') && !!id;

    if (this.isEditMode) {
      this.fetchWebServiceDetails(id);
      return;
    }

    this.getApplicationDetails(id);
    this.takeSnapshot();

  }

  createInitialPayload() {
    return {
      apiId: '',
      apiName: '',

      appName: '',
      appUuid: null,

      category: '',
      description: '',

      layer: '',
      webServiceType: '',
      httpMethod: '',

      accessedViaGateway: null,

      authenticationMethod: '',
      authorizationName: '',
      lifecycleStatus: '',

      swaggerUrl: '',
      docsUrl: '',

      urlProd: '',
      urlDr: '',
      urlUat: '',
      urlSit: '',

      requestBodySample: '',
      requestDataFormat: '',
      requestDataSensitivityType: '',
      requestDataInTransitEnc: '',
      requestAveSize: '',
      requestMaxSize: '',

      requestDataLogged: null,
      requestDataCached: null,
      requestDuplicateAllowed: null,
      requestThrottlingSupported: null,

      responseBodySample: '',
      responseDataFormat: '',
      responseDataSensitivityType: '',
      responseDataInTransitEnc: '',
      responseAveSize: '',
      responseMaxSize: '',

      responseDataLogged: null,
      responseDataCached: null,

      rateLimitInfo: '',
      exposure: ''

    };

  }

  getIdFromUrl(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  takeSnapshot(): void {
    this.initialSnapshot =
      JSON.stringify(this.payload);
  }

  hasChanges(): boolean {
    return (
      JSON.stringify(this.payload) !==
      this.initialSnapshot
    );

  }

  isSaveDisabled(form: any): boolean {
    if (!form.valid) {
      return true;
    }

    return this.isEditMode
      ? !this.hasChanges()
      : false;

  }

  clearSearchState(): void {
    localStorage.removeItem('web_services_search_state');

  }


  fetchDropdownOptions(): void {

    this.applicationApiService
      .getDropdownOptions('API_DETAILS')
      .pipe(first())
      .subscribe({

        next: (res: any) => {

          this.dropdownOptions = {
            ...res.data
          };

          this.fetchLifeCycleStatus();

        },

        error: (err: any) => {

          console.error(
            'Dropdown Error:',
            err
          );

        }

      });

  }

  fetchLifeCycleStatus(): void {

    this.applicationApiService
      .getDropdownOptions(
        'APPLICATION_DETAILS'
      )
      .pipe(first())
      .subscribe({

        next: (res: any) => {

          this.dropdownOptions = {
            ...this.dropdownOptions,
            LIFECYCLE_STATUS: res.data?.LIFECYCLE_STATUS || []

          };

        },

        error: (err: any) => {
          console.error('Lifecycle Error:', err);

        }

      });

  }

  getApplicationDetails(id: string): void {

    if (!id) return;

    this.applicationApiService
      .getAppDetails(id)
      .pipe(first())
      .subscribe({

        next: (res: any) => {

          const data = res.data;

          this.payload.appUuid =
            data.appUuid;

          this.payload.appName =
            data.appName;

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

  fetchWebServiceDetails(id: string): void {
    this.webServiceApiService
      .getWebServicesDetails(id)
      .pipe(first())
      .subscribe({

        next: (res: any) => {

          const data = res.data;
          const serviceConfig = data.serviceConfig?.[0] || {};
          const security = data.securityAndAuth?.[0] || {};
          const environment = data.environmentUrls?.[0] || {};

          this.payload = {

            ...this.payload,

            appUuid: serviceConfig.appUuid,
            appName: serviceConfig.appName,
            apiName: serviceConfig.name,
            category: serviceConfig.category,
            description: serviceConfig.description,
            layer: data.layer,
            webServiceType: serviceConfig.type,
            httpMethod: serviceConfig.method,
            lifecycleStatus: serviceConfig.status,
            accessedViaGateway: serviceConfig.accessedViaGateway,
            exposure: data.exposure,
            authenticationMethod: security.authMethod,
            authorizationName: security.authorization,
            urlProd: environment.prodURL,
            urlDr: environment.drURL,
            urlUat: environment.uatURL,
            urlSit: environment.sitURL,
            docsUrl: data.documentsURL,
            swaggerUrl: data.swaggerURL,
            requestDataFormat: data.requestDataFormat,
            requestDataSensitivityType: data.dataSensitiveType,
            requestDataInTransitEnc: data.dataInTransitEncryption,
            requestAveSize: data.aveReqSize,
            requestMaxSize: data.maxReqSize,
            requestDataLogged: data.requestDataLogged,
            requestDataCached: data.reqDataCached,
            requestDuplicateAllowed: data.reqDuplicateAllowed,
            requestThrottlingSupported: data.reqThrottlingSupported,
            requestBodySample: data.requestBodySample,
            responseDataFormat: data.responseDataFormat,
            responseDataSensitivityType: data.responseDataSensitivityType,
            responseDataInTransitEnc: data.responseDataInTransitEncryption,
            responseAveSize: data.averageResponseSize,
            responseMaxSize: data.maxResponseSize,
            responseDataLogged: data.responseDataLogged,
            responseDataCached: data.responseDataCached,
            responseBodySample: data.responseBodySample,
            rateLimitInfo: data.rateLimitInfo

          };

          this.takeSnapshot();

        },

        error: (err: any) => {

          console.error(
            'Web Service Details Error:',
            err
          );

        }

      });

  }

  onCancel(): void {

    const id = this.getIdFromUrl();

    const route =
      this.isEditMode
        ? `/web-services/details/${id}`
        : `/application/details/${id}`;

    this.router.navigate([route]);

  }

  navigateAfterSave(): void {

    const id = this.getIdFromUrl();

    const route =
      this.isEditMode
        ? `/web-services/details/${id}`
        : `/application/details/${id}`;

    this.router.navigate([route]);

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

        const id =
          this.getIdFromUrl();

        const request$ =
          this.isEditMode
            ? this.webServiceApiService
              .updateApiDetails(
                this.payload,
                id
              )
            : this.webServiceApiService
              .addApiDetails(
                this.payload
              );

        request$
          .pipe(first())
          .subscribe({

            next: () => {

              this.clearSearchState();

              this.showSuccessModal(
                this.isEditMode
                  ? 'Web Service successfully updated.'
                  : 'Web Service successfully saved.'
              );

              setTimeout(() => {

                this.payload = this.createInitialPayload();
                this.takeSnapshot();
                this.navigateAfterSave();

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

  deleteWebService(): void {

    const id =
      this.getIdFromUrl();

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

        this.webServiceApiService
          .deleteApiDetails(id)
          .pipe(first())
          .subscribe({

            next: () => {

              this.clearSearchState();

              this.showSuccessModal(
                'Web Service successfully deleted.'
              );

              setTimeout(() => {

                this.payload = this.createInitialPayload();
                this.takeSnapshot();

                this.router.navigate([
                  '/web-services'
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

      title: 'Success!',
      body,

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
    this.webServiceApiService
      .getValidationProperties()
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          this.validations = res.data;
          console.log(JSON.stringify(res.data))
        },
        error: (err) => {
          console.error('Validation Error:', err);
        }
      });
  }

  getValidation(field: string): any {
    return this.validations?.[field] || {};
  }

  isRequired(field: string): boolean {
    return this.getValidation(field)?.required === true;
  }

  getMinLength(field: string): number | null {
    return this.getValidation(field)?.minLength;
  }

  getMaxLength(field: string): number | null {
    return this.getValidation(field)?.maxLength;
  }

  getPattern(field: string): string | null {
    return this.getValidation(field)?.pattern;
  }

  getErrorMessage(field: string, control: any): string {
    const validation = this.getValidation(field);

    if (!control?.errors) {
      return '';
    }

    if (control.errors['required']) {
      return `${field} is required`;
    }

    if (control.errors['minlength']) {
      return `Minimum length is ${validation.minLength}`;
    }

    if (control.errors['maxlength']) {
      return `Maximum length is ${validation.maxLength}`;
    }

    if (control.errors['pattern']) {
      return 'Invalid format';
    }

    return 'Invalid value';
  }

}