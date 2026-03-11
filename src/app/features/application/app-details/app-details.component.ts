import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Application, BasicInfo, LinkAndResources, TechStack } from '../../../core/models/interface';
import { ApplicationApiService } from '../services/application-api-service.service';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { MatDialog } from '@angular/material/dialog';
import { VersionModalComponent } from '../../../shared/components/version-modal/version-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SplitPipe } from '../../../shared/pipes/split/split.pipe';

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
    SplitPipe
  ],
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss']
})
export class AppDetailsComponent implements OnInit {
  appDetails: Application | undefined = undefined;
  appBasicInfo: BasicInfo | undefined = undefined;
  appLinkAndResources: LinkAndResources | undefined = undefined;
  appTechStack: TechStack | undefined = undefined;

  displayedServiceColumns: string[] = ['name', 'description', 'version', 'status', 'options'];
  displayedVersionColumns: string[] = ['version', 'date', 'stage', 'env', 'build', 'documents', 'options'];

  applicationDetails: any = [];
  wsData: any = [];

  versionData: any = [];

  constructor(
    private applicationApiService: ApplicationApiService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchAppDetails();
    this.getWebServicesList();
    this.fetchAppVersions();
  }

  fetchAppDetails() {
    const appUuid = this.getIdFromUrl();

    this.applicationApiService.getAppDetails(appUuid).subscribe({
      next: (data: any) => {
        // console.log(data.data);
        this.applicationDetails = data.data;
      },
      error: (err: any) => {
        console.log('Error: ' + err);
      }
    })
  }

  // get id from url
  getIdFromUrl() {
    return this.router.url.split('/')[2];
  }

  openEditPage() {
    console.log('Edit');
  }

  getWebServicesList() {
    const appUuid = this.getIdFromUrl();

    this.applicationApiService.getWebServicesList(appUuid, 0).subscribe({
      next: (data: any) => {
        console.log(data)
        this.wsData = data.data;
      },
      error: (err: any) => {
        console.log('Error: ' + err);
      }
    })
  }

  onHandleWSPage(newPage: number) {
    const appUuid = this.getIdFromUrl();
    this.wsData = [];

    this.applicationApiService.getWebServicesList(appUuid, newPage).subscribe({
      next: (res: any) => {
        this.wsData = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  onHandleVersionPage(newPage: number) {
    const appUuid = this.getIdFromUrl();
    this.versionData = [];

    this.applicationApiService.getVersionHistoryList(appUuid, newPage).subscribe({
      next: (res: any) => {
        // console.log(res)
        this.versionData = res.data;
      },
      error: (err) => console.error(err)
    });
  }


  openDialog(uuid: string): void {
    const dialogRef = this.dialog.open(VersionModalComponent, {
      width: '1000px',
      data: { uuid: uuid, type: 'application'  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  fetchAppVersions() {
    const appUuid = this.getIdFromUrl();
    this.applicationApiService.getVersionHistoryList(appUuid, 0).subscribe({
      next: (res: any) => {
        // console.log(res)
        this.versionData = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  openUrl(url: string | null | undefined): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No URL provided for this record.');
    }
  }

  openDetails(uuid: any) {
    this.router.navigate(['/web-service-details/' + uuid])
  }
}