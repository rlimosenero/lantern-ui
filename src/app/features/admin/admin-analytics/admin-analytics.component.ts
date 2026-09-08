import { Component, OnInit } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AdminAnalyticsService } from './admin-analytics.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

interface CompletenessData {
  applicationId: string;
  applicationName: string;
  completenessRate: number;
  status: string;
  completedFields: number;
  requiredFields: number;
  missingFields: string[];
}

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    KeyValuePipe,
    LoaderComponent,
    PaginationComponent
  ],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss'
})
export class AdminAnalyticsComponent implements OnInit {

  activeTab: 'applications' | 'webServices' = 'applications';

  isCompletenessLoading = false;

  summaryData: any = {};

  list: any = [];

  webServices: CompletenessData[] = [];

  activeCompletenessData: CompletenessData[] = [];

  constructor(
    private adminAnalyticsService: AdminAnalyticsService
  ) { }

  ngOnInit(): void {
    this.loadApplicationCompletenessData();
  }

  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, char => char.toUpperCase());
  }

  switchTab(tab: 'applications' | 'webServices'): void {

    if (this.activeTab === tab) {
      return;
    }

    this.activeTab = tab;

    if (tab === 'applications') {
      this.loadApplicationCompletenessData();
    } else {
      this.loadWebServicesCompletenessData();
    }
  }

  loadApplicationCompletenessData(): void {
    this.loadApplicationSummary();
    this.loadApplicationList(0);

  }

  loadApplicationList(page: number) {
    this.isCompletenessLoading = true;

    this.adminAnalyticsService.getApplicationCompleteness(page, 10).subscribe({
      next: (res: any) => {
        console.log('applicationlist');
        console.log(res);

        this.list = res.data;

        this.activeCompletenessData = res.data.results;

        this.isCompletenessLoading = false;
      },
      error: (err) => {
        console.error('Error fetching application completeness:', err);

        this.isCompletenessLoading = false;
      }
    });
  }

  loadApplicationSummary() {
    this.isCompletenessLoading = true;

    this.adminAnalyticsService.getCompletenessSummary().subscribe({
      next: (res: any) => {
        console.log('summary');
        console.log(res);

        this.summaryData = res.data;
      },
      error: (err) => {
        console.error('Error fetching completeness summary:', err);
      }
    });
  }

  loadWebServicesCompletenessData(): void {
    this.loadWebServiceSummary();
    this.loadWebServiceList(0);
    //API call for WS
    this.activeCompletenessData = this.webServices;
  }

  loadWebServiceSummary() {
    console.log('test');
  }

  loadWebServiceList(page: number) {
    console.log(page);
  }


  onHandlePage(newPage: number) {
    console.log(newPage)
    if (this.activeTab == 'applications') {
      this.loadApplicationList(newPage);

    } else {
      this.loadWebServiceList(newPage);
    }
  }

}