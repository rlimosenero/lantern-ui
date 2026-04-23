import { Component, OnInit, inject } from '@angular/core';
import { WebServicesApiService } from '../services/web-services-api.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
// import { ButtonComponent } from '../../../shared/components/button/button.component';
import { VersionModalComponent } from '../../../shared/components/version-modal/version-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { environment } from '../../../../environments/environment';
import { finalize } from 'rxjs';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { BreadcrumbService } from '../../../shared/components/breadcrumbs/breadcrumbs.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AuthService } from '../../../core/auth/auth.service';

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
  consumersFields: string[] = ['appName', 'appOwner', 'dateOnboarded', 'status', 'trigger', 'appType', 'techOwner', 'tokenExpiryDate', 'networkMode'];
  upstreamAppFields: string[] = ['appName', 'appOwner', 'tokenExpiryDate', 'techOwner']

  versionData: any = [];
  displayedVersionColumns: string[] = ['version', 'date', 'stage', 'env', 'build', 'documents', 'options'];
  public baseUrl = environment.baseUrl;

  constructor(
    private webServiceApiService: WebServicesApiService,
    private router: Router,
    private dialog: MatDialog,
    private breadcrumbService: BreadcrumbService
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
          console.log('true')
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
    this.router.navigate(['/app-details/' + uuid]);
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

  openEditPage() {
    this.router.navigate([`/web-services/details/${this.getIdFromUrl()}/edit`]);
  }

}
