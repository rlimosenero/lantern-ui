import { Component, OnInit } from '@angular/core';
import { WebServicesApiServiceService } from '../services/web-services-api-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { VersionModalComponent } from '../../../shared/components/version-modal/version-modal.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { environment } from '../../../../environments/environment';

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
    PaginationComponent
    // ButtonComponent
  ],
  templateUrl: './web-services-details.component.html',
  styleUrl: './web-services-details.component.scss',
})
export class WebServicesDetailsComponent implements OnInit {
  requestBodySampleString = '';
  responseBodySampleString = '';
  WSDetails: any = undefined;
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
    private webServiceApiService: WebServicesApiServiceService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchWebServiceDetails();
    this.fetchVersions();
  }

  fetchWebServiceDetails() {
    const WSId = this.getIdFromUrl();
    this.webServiceApiService.getWebServicesDetails(WSId).subscribe({
      next: (res: any) => {
        this.WSDetails = res.data;
        console.log(this.WSDetails)
        this.requestBodySampleString = this.WSDetails?.requestBodySample ? JSON.stringify(JSON.parse(this.WSDetails.requestBodySample), null, 2) : 'null';
        this.responseBodySampleString = this.WSDetails?.responseBodySample ? JSON.stringify(JSON.parse(this.WSDetails.responseBodySample), null, 2) : 'null';
      },
      error: (err: any) => console.error(err)
    });
  }

  getIdFromUrl() {
    return this.router.url.split('/')[2];
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

  onHandleVersionPage(newPage: number) {
    const appUuid = this.getIdFromUrl();
    this.versionData = [];

    this.webServiceApiService.getVersionHistoryList(appUuid, newPage).subscribe({
      next: (res: any) => {
        // console.log(res)
        this.versionData = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  fetchVersions() {
    const appUuid = this.getIdFromUrl();
    this.webServiceApiService.getVersionHistoryList(appUuid, 0).subscribe({
      next: (res: any) => {
        console.log(res)
        this.versionData = res.data;
      },
      error: (err) => console.error(err)
    });
  }

  openLink(uuid: string){
    this.router.navigate(['/app-details/' + uuid]);
  }

}
