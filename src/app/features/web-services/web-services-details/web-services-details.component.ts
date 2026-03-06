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

  constructor(
    private webServiceApiService: WebServicesApiServiceService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchWebServiceDetails();
  }

  fetchWebServiceDetails() {
    const WSId = this.getIdFromUrl();
    this.webServiceApiService.getWebServicesDetails(WSId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.WSDetails = res;
        this.requestBodySampleString = JSON.stringify(this.WSDetails.requestBodySampleString, null, 2);
        this.responseBodySampleString = JSON.stringify(this.WSDetails.responseBodySample, null, 2);
      },
      error: (err: any) => console.error(err)
    });
    // this.WSDetails = this.webServiceApiService.getWebServicesDetails(WSId);
    // this.requestBodySampleString = JSON.stringify(this.WSDetails?.requestBodySampleString, null, 2);
    // this.responseBodySampleString = JSON.stringify(this.WSDetails?.responseBodySample, null, 2);
  }

  getIdFromUrl() {
    return this.router.url.split('/')[2];
  }
}
