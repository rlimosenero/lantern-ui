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
    MatTableModule
  ],
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.scss']
})
export class AppDetailsComponent implements OnInit {
  appDetails: Application | undefined = undefined;
  appBasicInfo: BasicInfo | undefined = undefined;
  appLinkAndResources: LinkAndResources | undefined = undefined;
  appTechStack: TechStack | undefined = undefined;

  applicationDetails: any = [];

  constructor(
    private applicationApiService: ApplicationApiService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchAppDetails();
    // this.fetchAppDetailsBE();
  }

  // fetchAppDetails() {
  //   const appUuid = this.getIdFromUrl();

  //   // get app details by id
  //   this.appDetails = this.applicationApiService.getAppDetails(appUuid);
  //   this.appBasicInfo = this.appDetails?.basicInfo[0];
  //   this.appTechStack = this.appDetails?.techStack[0];
  //   this.appLinkAndResources = this.appDetails?.linkAndResources[0];
  // }

  fetchAppDetails(){
    const appUuid = this.getIdFromUrl();

    this.applicationApiService.getAppDetails(appUuid).subscribe({
      next: (data:any) => {
        console.log(data.data);
        this.applicationDetails = data.data;
      },
      error: (err:any) => {
        console.log('Error: ' + err);
      }
    })
  }

  // get id from url
  getIdFromUrl() {
    return this.router.url.split('/')[2];
  }

  openEditPage(){
    console.log('Edit');
  }

  // Mock Data for Tables
  webServices = [
    { name: 'User Authentication API', desc: 'OAuth 2.0 authentication and authorization service', version: '1.5.0', status: 'Active' },
    { name: 'Payment Gateway', desc: 'Payment processing and transaction management', version: '2.3.1', status: 'Active' },
    { name: 'Notification Service', desc: 'Push notifications and SMS delivery service', version: '2.0.0', status: 'Active' }
  ];

  versionHistory = [
    { version: '3.2.1', date: 'Jan 25, 2024, 17:20:00', stage: 'STABLE', env: 'PROD', build: '+build.312' },
    { version: '3.2.0', date: 'Dec 15, 2023, 21:45:00', stage: 'MINOR', env: 'UAT', build: '+build.298' },
    { version: '3.2.0-beta.1', date: 'Dec 1, 2023, 16:30:00', stage: 'BETA', env: 'SIT', build: '+build.285' },
    { version: '3.0.0', date: 'Oct 10, 2023, 23:00:00', stage: 'MAJOR', env: 'PROD', build: '+build.250' }
  ];

  displayedServiceColumns: string[] = ['name', 'description', 'version', 'status', 'options'];
  displayedVersionColumns: string[] = ['version', 'date', 'stage', 'env', 'build', 'documents', 'options'];


  openDialog(): void {
    const dialogRef = this.dialog.open(VersionModalComponent, {
      width: '1000px',
      data: { name: 'App Detail' } // Optional: pass data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}