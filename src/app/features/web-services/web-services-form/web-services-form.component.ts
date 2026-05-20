import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
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

  dropdownOptions: any = [];

  payload: any = {
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

  constructor(
    private applicationApiService: ApplicationApiService,
    private webServiceApiService: WebServicesApiService,
    private modalService: ModalService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fetchDropdownOptions('API_DETAILS');
    this.fetchLifeCycleStatus();

    const url = this.route.snapshot.url.map(s => s.path);
    const id = this.route.snapshot.paramMap.get('id');

    this.isEditMode = url.includes('edit') && !!id;

    if (this.isEditMode && id) {
      this.takeSnapshot();
      this.fetchWebServiceDetails();
    } else {
      this.getApplicationDetails();
    }

  }

  takeSnapshot() {
    this.initialSnapshot = JSON.stringify(this.payload);
  }

  hasChanges(): boolean {
    return JSON.stringify(this.payload) !== this.initialSnapshot;
  }

  getIdFromUrl(): any {
    return this.route.snapshot.paramMap.get('id');
  }

  getApplicationDetails() {
    this.applicationApiService.getAppDetails(this.getIdFromUrl()).subscribe({
      next: (data: any) => {
        this.payload.appUuid = data.data.appUuid;
        this.payload.appName = data.data.appName;
      }
    });
  }

  fetchWebServiceDetails() {
    const WSId = this.getIdFromUrl();

    this.webServiceApiService.getWebServicesDetails(WSId).subscribe({
      next: (res: any) => {
        const data = res.data;

        this.payload.appUuid = data.serviceConfig[0].appUuid;
        this.payload.appName = data.serviceConfig[0].appName;

        this.payload.apiName = data.serviceConfig[0].name;
        this.payload.category = data.serviceConfig[0].category;
        this.payload.description = data.serviceConfig[0].description;

        this.payload.layer = data.layer;
        this.payload.webServiceType = data.serviceConfig[0].type;
        this.payload.httpMethod = data.serviceConfig[0].method;
        this.payload.lifecycleStatus = data.serviceConfig[0].status;
        this.payload.authenticationMethod = data.securityAndAuth[0].authMethod;
        this.payload.authorizationName = data.securityAndAuth[0].authorization;
        this.payload.accessedViaGateway = data.serviceConfig[0].accessedViaGateway;
        this.payload.exposure = data.exposure;

        this.payload.urlProd = data.environmentUrls[0].prodURL;
        this.payload.urlDr = data.environmentUrls[0].drURL;
        this.payload.urlUat = data.environmentUrls[0].uatURL;
        this.payload.urlSit = data.environmentUrls[0].sitURL;
        this.payload.docsUrl = data.documentsURL;
        this.payload.swaggerUrl = data.swaggerURL;

        this.payload.requestDataFormat = data.requestDataFormat;
        this.payload.requestDataSensitivityType = data.dataSensitiveType;
        this.payload.requestDataInTransitEnc = data.dataInTransitEncryption;
        this.payload.rateLimitInfo = data.rateLimitInfo;
        this.payload.requestAveSize = data.aveReqSize;
        this.payload.requestMaxSize = data.maxReqSize;
        this.payload.requestDataLogged = data.requestDataLogged;
        this.payload.requestDataCached = data.reqDataCached;
        this.payload.requestDuplicateAllowed = data.reqDuplicateAllowed;
        this.payload.requestThrottlingSupported = data.reqThrottlingSupported;
        this.payload.requestBodySample = data.requestBodySample;

        this.payload.responseDataFormat = data.responseDataFormat;
        this.payload.responseDataSensitivityType = data.responseDataSensitivityType;
        this.payload.responseDataInTransitEnc = data.responseDataInTransitEncryption;
        this.payload.responseAveSize = data.averageResponseSize;
        this.payload.responseMaxSize = data.maxResponseSize;
        this.payload.responseDataLogged = data.responseDataLogged;
        this.payload.responseDataCached = data.responseDataCached;
        this.payload.responseBodySample = data.responseBodySample;

      },
      error: (err: any) => console.error(err)
    });
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

  fetchLifeCycleStatus() {
    this.applicationApiService.getDropdownOptions('APPLICATION_DETAILS').subscribe({
      next: (data: any) => {
        this.dropdownOptions['LIFECYCLE_STATUS'] = data.data['LIFECYCLE_STATUS'];

      },
      error: (err: any) => {
        console.log('Error: ' + err);
      }
    })
  }

  isSaveDisabled(form: any): boolean {
    if (!form.valid) return true;
    if (this.isEditMode) return !this.hasChanges();
    return false;
  }

  onCancel() {
    const id = this.route.snapshot.paramMap.get('id');

    if (this.isEditMode) {
      this.router.navigate([`/web-services/details/${id}`])
    } else {
      this.router.navigate([`/application/details/${id}`])
    }

  }

  onSave() {
    const id = this.route.snapshot.paramMap.get('id');

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

          this.webServiceApiService.updateApiDetails(this.payload, id).subscribe({
            next: (res) => {
              localStorage.removeItem('web_services_search_state')
              this.modalService.update({
                title: 'Success!',
                body: 'Web Service successfully updated.',
                icon: 'check_circle',
                theme: 'success',
                loading: false,
                autoClose: 1500
              });
              setTimeout(() => {
                this.router.navigate([`/web-services/details/${id}`])
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

        } else {
          this.webServiceApiService.addApiDetails(this.payload).subscribe({
            next: (res) => {
              localStorage.removeItem('web_services_search_state')
              this.modalService.update({
                title: 'Success!',
                body: 'Web Service successfully saved.',
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
          })
        }

      }

    })

  }

}