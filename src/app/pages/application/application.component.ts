import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MonitoringService } from '../../services/monitoring.service';
import { Application } from '../../models/interface';
import { ApplicationApiServiceService } from '../../services/application-api-service.service';

@Component({
  selector: 'app-application',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss',
})
export class ApplicationComponent implements OnInit {
  private route = inject(Router);
  displayedColumns: string[] = ['name', 'desc', 'version', 'status', 'options'];

  appList: Application[] = [];

  constructor(
    private applicationApiService: ApplicationApiServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchAppDetails();
  }

  fetchAppDetails() {
    this.appList = this.applicationApiService.getAppList();
  }

  openAppDetailsPage(index: number) {
    const appID = this.getAppID(index).applicationId;
    this.route.navigate(['/app-details/' + appID])
  }

  getAppID(index: number): Application {
    return this.appList[index];
  }

}
