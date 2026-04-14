import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Application, BasicInfo, LinkAndResources, TechStack } from '../../../core/models/interface';
import { ApplicationApiService } from '../services/application-api.service';
import { Router, ActivatedRoute } from '@angular/router';
// import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { VersionModalComponent } from '../../../shared/components/version-modal/version-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SplitPipe } from '../../../shared/pipes/split/split.pipe';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { finalize } from 'rxjs';
import { BreadcrumbService } from '../../../shared/components/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'app-app-details',
  standalone: true,
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
    SplitPipe,
    LoaderComponent
  ],
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss']
})
export class AppDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  appDetails: Application | undefined = undefined;
  appBasicInfo: BasicInfo | undefined = undefined;
  appLinkAndResources: LinkAndResources | undefined = undefined;
  appTechStack: TechStack | undefined = undefined;

  displayedServiceColumns: string[] = ['name', 'description', 'version', 'status', 'options'];
  displayedVersionColumns: string[] = ['version', 'date', 'stage', 'env', 'build', 'documents', 'options'];

  applicationDetails: any = [];
  wsData: any = [];

  versionData: any = [];

  isVersionListLoading = true;
  isWebServiceListLoading = true;

  constructor(
    private applicationApiService: ApplicationApiService,
    private router: Router,
    private dialog: MatDialog,
    private breadcrumbService: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.clearAllOverrides();

    this.fetchAppDetails();
    this.getWebServicesList();
    this.fetchAppVersions();
  }

  mockList() {
    return new Array(5).fill({});
  }

  fetchAppDetails() {
    const appUuid = this.getIdFromUrl();
    const keyword = this.route.snapshot.queryParamMap.get('searchKeyword');

    this.applicationApiService.getAppDetails(appUuid).subscribe({
      next: (data: any) => {
        this.applicationDetails = data.data;

        if (keyword) {
          this.breadcrumbService.setOverride('/search', 'Search');
        }

        this.breadcrumbService.setOverride(this.router.url, data.data.appName);

        setTimeout(() => this.scrollToKeyword(), 300);
      },
      error: (err: any) => {
        console.log('Error: ' + err);
      }
    })
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

      // Wrap the matching text in a span with red color
      target.innerHTML = originalHTML.replace(regex, `<span class="search-highlight" style="color: #ba1a1a;">$1</span>`);

      setTimeout(() => {
        target.innerHTML = originalHTML;
      }, 3000);
    }
  }

  // get id from url
  getIdFromUrl(): any {
    return this.route.snapshot.paramMap.get('id');
  }

  openEditPage() {
    console.log('Edit');
  }

  getWebServicesList() {
    this.loadWebServiceList(0);
  }

  loadWebServiceList(page: number) {
    this.isWebServiceListLoading = true;
    const appUuid = this.getIdFromUrl();

    this.applicationApiService.getWebServicesList(appUuid, page).pipe(
      finalize(() => this.isWebServiceListLoading = false)
    ).subscribe({
      next: (data: any) => {
        this.wsData = data.data;
      },
      error: (err: any) => {
        console.log('Error: ' + err);
      }
    })
  }

  onHandleWSPage(newPage: number) {
    this.wsData.results = this.mockList();
    this.loadWebServiceList(newPage);
  }

  openDialog(uuid: string): void {
    const dialogRef = this.dialog.open(VersionModalComponent, {
      width: '1000px',
      height: '750px',
      data: { uuid: uuid, type: 'application' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  fetchAppVersions() {
    this.loadVersionList(0);
  }

  onHandleVersionPage(newPage: number) {
    this.versionData.results = this.mockList();
    this.loadVersionList(newPage)
  }

  loadVersionList(page: number) {
    this.isVersionListLoading = true;
    const appUuid = this.getIdFromUrl();

    this.applicationApiService.getVersionHistoryList(appUuid, page).pipe(
      finalize(() => this.isVersionListLoading = false)
    ).subscribe({
      next: (res: any) => {
        this.versionData = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  openUrl(url: string | null | undefined): void {
    console.log('clicked')
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No URL provided for this record.');
    }
  }

  openDetails(uuid: any) {
    this.router.navigate(['/web-services/details/' + uuid])
  }
}