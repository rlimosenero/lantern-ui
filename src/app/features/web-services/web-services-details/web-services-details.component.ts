import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, first } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';

import { VersionModalComponent } from '../../../shared/components/version-modal/version-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { environment } from '../../../../environments/environment';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

import { WebServicesApiService } from '../services/web-services-api.service';
import { BreadcrumbService } from '../../../shared/components/breadcrumbs/breadcrumbs.service';
import { AuthService } from '../../../core/auth/auth.service';
import { DataFieldsModalService } from '../../../shared/components/data-fields-modal/data-fields-modal.service';
import { VersionFormsModalService } from '../../../shared/components/version-forms-modal/version-forms-modal.service';
import { VersionModalService } from '../../../shared/components/version-modal/version-modal.service';
import { StatusCodesModalService } from '../../../shared/components/status-codes-modal/status-codes-modal.service';
import { ConsumerAppFormsModalService } from '../../../shared/components/consumer-app-forms-modal/consumer-app-forms-modal.service';
import { UpstreamAppFormsModalService } from '../../../shared/components/upstream-app-forms-modal/upstream-app-forms-modal.service';

@Component({
  selector: 'app-web-services-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTableModule,
    PaginationComponent,
    LoaderComponent,
    ButtonComponent
  ],
  templateUrl: './web-services-details.component.html',
  styleUrl: './web-services-details.component.scss',
})
export class WebServicesDetailsComponent implements OnInit {
  public auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  requestBodySampleString = '';
  responseBodySampleString = '';
  WSDetails: any = undefined;

  isLoading = true;

  genericColumn: string[] = ['paramName', 'typeAndFormat', 'isRequired', 'value', 'desc'];
  reqBodyFields: string[] = ['name', 'typeAndFormat', 'desc', 'isRequired', 'sampleValue', 'rules', 'logic', 'defaultValue'];
  resBodyFields: string[] = ['name', 'typeAndFormat', 'desc', 'isRequired', 'sampleValue', 'rules', 'logic', 'defaultValue', 'sourceOrDomainApplication', 'sourceOrDomainFieldName'];
  statusCodesFields: string[] = ['HTTPCode', 'businessCode', 'message', 'type', 'suggestedAction'];
  displayedVersionColumns: string[] = ['version', 'date', 'stage', 'env', 'build', 'documents', 'options'];

  versionData: any = [];
  public baseUrl = environment.baseUrl;

  configMap: any = {
    urlPathParameters: {
      title: 'URL Path Parameters',
      columns: [
        { key: 'parameterName', label: 'Name', required: true },
        { key: 'typeAndFormat', label: 'Data Type and Format' },
        { key: 'isRequired', label: 'Required', type: 'boolean' },
        { key: 'sampleValue', label: 'Sample Value' },
        { key: 'description', label: 'Description' }
      ]
    },

    requestHeaders: {
      title: 'Request Header',
      columns: [
        { key: 'parameterName', label: 'Name', required: true },
        { key: 'typeAndFormat', label: 'Data Type and Format' },
        { key: 'isRequired', label: 'Required', type: 'boolean' },
        { key: 'sampleValue', label: 'Sample Value' },
        { key: 'description', label: 'Description' }
      ]
    },

    requestBodyFields: {
      title: 'Request Body',
      columns: [
        { key: 'fieldName', label: 'Field', required: true },
        { key: 'typeAndFormat', label: 'Data Type and Format' },
        { key: 'isRequired', label: 'Required', type: 'boolean' },
        { key: 'sampleValue', label: 'Sample Value' },
        { key: 'validationRules', label: 'Validation' },
        { key: 'defaultValue', label: 'Default' }
      ]
    },

    responseHeaders: {
      title: 'Response Headers',
      columns: [
        { key: 'headerName', label: 'Header', required: true },
        { key: 'typeAndFormat', label: 'Data Type and Format' },
        { key: 'isRequired', label: 'Required', type: 'boolean' },
        { key: 'sampleValue', label: 'Sample Value' },
        { key: 'description', label: 'Description' }
      ]
    },

    responseBodyFields: {
      title: 'Response Body',
      columns: [
        { key: 'fieldName', label: 'Name', required: true },
        { key: 'typeAndFormat', label: 'Data Type and Format' },
        { key: 'description', label: 'Description' },
        { key: 'isRequired', label: 'Required', type: 'boolean' },
        { key: 'sampleValue', label: 'Sample Value' },
        { key: 'validationRules', label: 'Validation Rules' },
        { key: 'transformationLogic', label: 'Transformation Logic' },
        { key: 'defaultValue', label: 'Default Value' },
        { key: 'sourceOrDomainApplication', label: 'Source/Domain Application' },
        { key: 'sourceOrDomainFieldName', label: 'Source/Domain Field Name' },
      ]
    }
  };

  private readonly sensitivityTypeMap: Record<string, string> = {
    PUBLIC: 'Public',
    INTERNAL: 'Internal',
    CONFIDENTIAL: 'Confidential',
    FINANCIAL_DATA: 'Financial Data',
    PII: 'Restricted: Personally Identifiable Information (PII)',
    SPI: 'Restricted: Sensitive Personal Information (SPI)',
    PHI: 'Restricted: Protected Health Information (PHI)',
    PCI: 'Restricted: Payment Card Information (PCI)',
    SECURITY_SENSITIVE: 'Restricted: Security-Sensitive',
    CUSTOMER_DATA_NON_PII: 'Customer Data (Non-PII)'
  };

  constructor(
    private webServiceApiService: WebServicesApiService,
    private router: Router,
    private dialog: MatDialog,
    private versionFormsModalService: VersionFormsModalService,
    private versionModalService: VersionModalService,
    private breadcrumbService: BreadcrumbService,
    private crudModalService: DataFieldsModalService,
    private statusCodesModalService: StatusCodesModalService,
    private consumerAppFormsModalService: ConsumerAppFormsModalService,
    private upstreamAppFormsModalService: UpstreamAppFormsModalService
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.clearAllOverrides();

    this.fetchWebServiceDetails();
    this.fetchVersions();
  }

  fetchWebServiceDetails() {
    const WSId = this.getIdFromUrl();
    const keyword = this.route.snapshot.queryParamMap.get('searchKeyword');

    this.webServiceApiService.getWebServicesDetails(WSId).subscribe({
      next: (res: any) => {
        this.WSDetails = res.data;
        const serviceName = res.data.serviceConfig?.[0]?.name || 'Service Details';

        if (keyword) {
          this.breadcrumbService.setOverride('/search', 'Search');
        }

        this.breadcrumbService.setOverride(this.router.url, serviceName);

        this.requestBodySampleString = this.formatSample(this.WSDetails?.requestBodySample);
        this.responseBodySampleString = this.formatSample(this.WSDetails?.responseBodySample);

        setTimeout(() => this.scrollToKeyword(), 300);
      },
      error: (err: any) => console.error(err)
    });
  }

  scrollToKeyword() {
    const keyword = this.route.snapshot.queryParamMap.get('searchKeyword');
    if (!keyword || keyword.trim() === '') return;

    const elements = document.querySelectorAll('h1, h2, h3, h4, span, td, b, p, div, a');

    const target = Array.from(elements).find(el =>
      el.childNodes.length > 0 &&
      Array.from(el.childNodes).some(node => node.nodeType === Node.TEXT_NODE) &&
      el.textContent?.toLowerCase().includes(keyword.toLowerCase())
    ) as HTMLElement;

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });


      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedKeyword})`, 'gi');

      const originalHTML = target.innerHTML;

      target.innerHTML = originalHTML.replace(regex, `<span class="search-highlight" style="color: #ba1a1a;">$1</span>`);

      setTimeout(() => {
        target.innerHTML = originalHTML;
      }, 3000);
    }
  }

  getIdFromUrl(): any {
    return this.route.snapshot.paramMap.get('id');
  }

  openDialog(uuid: string): void {
    const dialogRef = this.dialog.open(VersionModalComponent, {
      width: '1000px',
      data: { uuid: uuid, type: 'web-service' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  openUrl(url: string | null | undefined): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No URL provided for this record.');
    }
  }

  // initial placeholder
  mockAppList() {
    return new Array(5).fill({});
  }

  onHandleVersionPage(newPage: number) {
    this.versionData.results = this.mockAppList();
    this.loadVersionData(newPage);
  }

  loadVersionData(page: number) {
    this.isLoading = true;
    const appUuid = this.getIdFromUrl();

    this.webServiceApiService.getVersionHistoryList(appUuid, page).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (res: any) => {
        this.versionData = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  fetchVersions() {
    this.loadVersionData(0);
  }

  openLink(uuid: string) {
    this.router.navigate(['/application/details/' + uuid]);
  }

  formatSample(rawString: string | null | undefined): string {
    if (!rawString) return 'null';

    const trimmed = rawString.trim();

    try {
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        return JSON.stringify(JSON.parse(trimmed), null, 2);
      }


      if (trimmed.startsWith('<')) {
        return this.formatXml(trimmed);
      }
    } catch (e) {
      console.warn('Could not parse sample data, displaying as plain text', e);
    }

    return trimmed;
  }

  private formatXml(xml: string): string {
    let formatted = '';
    let indent = '';
    const tab = '  ';

    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) {

        indent = indent.substring(tab.length);
      }
      formatted += indent + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/)) {

        indent += tab;
      }
    });
    return formatted.substring(1, formatted.length - 3);
  }

  openCrudModal(type: any, data?: any[]) {

    this.crudModalService.open({
      ...this.configMap[type],
      appApiUuid: this.WSDetails.uuid,
      data: data,
      unusedData: this.getUnusedDataFields(type)

    })
      .pipe(first())
      .subscribe((result: any) => {
        if (result) {
          this.fetchVersions();

        }

      });
  }

  openEditPage() {
    this.router.navigate([`/web-services/details/${this.getIdFromUrl()}/edit`]);
  }

  private getUnusedDataFields(targetKey: string): any[] {
    let unused: any[] = [];

    if (targetKey !== 'urlPathParameters') unused = [...unused, ...this.mapToDTO(this.WSDetails.urlPathParameters, 'URL_PATH_PARAMETER')];
    if (targetKey !== 'requestHeaders') unused = [...unused, ...this.mapToDTO(this.WSDetails.requestHeaders, 'REQUEST_HEADER')];
    if (targetKey !== 'requestBodyFields') unused = [...unused, ...this.mapToDTO(this.WSDetails.requestBodyFields, 'REQUEST_BODY')];
    if (targetKey !== 'responseHeaders') unused = [...unused, ...this.mapToDTO(this.WSDetails.responseHeaders, 'RESPONSE_HEADER')];
    if (targetKey !== 'responseBodyFields') unused = [...unused, ...this.mapToDTO(this.WSDetails.responseBodyFields, 'RESPONSE_BODY')];

    return unused;
  }

  private mapToDTO(rows: any[], payloadType: string): any[] {
    if (!rows || rows.length === 0) return [];

    return rows.map(row => ({
      dataFieldUuid: row.dataFieldUuid || null,
      appApiUuid: this.WSDetails.uuid,
      payloadType: payloadType,
      fieldName: row.fieldName || row.parameterName || row.headerName || '',
      dataTypeFormat: row.typeAndFormat || '',
      description: row.description || '',
      isRequired: !!row.isRequired,
      sampleValue: row.sampleValue || '',
      validation: row.validationRules || '',
      transformationLogic: row.transformationLogic || '',
      defaultValue: row.defaultValue || '',
      sourceApplicationName: row.sourceOrDomainApplication || '',
      sourceFieldName: row.sourceOrDomainFieldName || '',
      endpoint: row.endpoint || ''
    }));

  }

  openVersionModal(versionDetails?: any) {
    this.versionFormsModalService.open({
      appInfo: {
        appApiUuid: this.WSDetails?.uuid,
        appUuid: this.WSDetails?.serviceConfig[0].appUuid
      },
      versionType: 'API',
      details: versionDetails
    }).pipe(first()).subscribe(result => {
      if (result) {
        this.fetchVersions();
      }
    });
  }

  editVersion(i: number) {
    this.versionModalService.getApiVersionDetails(this.versionData.results[i].apiVersionUuid).pipe(first()).subscribe({
      next: (res: any) => {
        // console.log(res.data);
        this.openVersionModal(res.data);
      },
      error: (err) => console.error(err)
    })

  }

  openResponseCodesModal() {
    this.statusCodesModalService.open({
      appApiUuid: this.WSDetails.uuid,
      data: this.WSDetails.responseStatusCodes
    }).pipe(first()).subscribe(res => {
      if (res) {
        // this.refreshData();
        console.log(res)
      }
    });
  }

  openConsumerAppModal(index?: number) {
    let details: any;

    if (index != undefined) {
      details = this.WSDetails.consumerApplications[index]
    }

    this.consumerAppFormsModalService.open({
      appApiUuid: this.WSDetails.uuid,
      details
    })
      .pipe(first())
      .subscribe((result: any) => {

        if (result) {
          this.fetchWebServiceDetails();
        }

      });
  }

  openUpstreamAppModal(index?: number) {
    let details;

    if (index != undefined) {
      console.log(this.WSDetails.upstreamApplications[index])
      details = this.WSDetails.upstreamApplications[index]
    }

    this.upstreamAppFormsModalService.open({
      appApiUuid: this.WSDetails.uuid,
      appUuid: this.WSDetails.serviceConfig[0].appUuid,
      details
    })
      .pipe(first())
      .subscribe((result: any) => {

        if (result) {
          this.fetchWebServiceDetails();
        }

      });
  }

  setConsumerTableColumns() {
    if (this.auth.isAdmin()) {
      return ['appName', 'appOwner', 'dateOnboarded', 'status', 'trigger', 'appType', 'techOwner', 'tokenExpiryDate', 'networkMode', 'options'];
    } else {
      return ['appName', 'appOwner', 'dateOnboarded', 'status', 'trigger', 'appType', 'techOwner', 'tokenExpiryDate', 'networkMode'];
    }
  }

  setUpstreamTableColumns() {
    if (this.auth.isAdmin()) {
      return ['appName', 'appOwner', 'tokenExpiryDate', 'techOwner', 'options']
    } else {
      return ['appName', 'appOwner', 'tokenExpiryDate', 'techOwner']
    }
  }

  parseSensitivityType(type?: string | null): string {
    if (!type) return 'N/A';

    return this.sensitivityTypeMap[type] ?? 'N/A';
  }

}
