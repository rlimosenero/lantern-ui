import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';

import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AdminAnalyticsService } from './admin-analytics.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

interface CompletenessData {
  uuid: string;
  name: string;
  completenessRate: number;
  mandatoryCompletenessRate: number;
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
    private adminAnalyticsService: AdminAnalyticsService,
    private router: Router
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

  async loadApplicationCompletenessData(): Promise<void> {
    this.isCompletenessLoading = true;

    try {
      await Promise.all([
        this.loadApplicationSummary(),
        this.loadApplicationList(0)
      ]);
    } finally {
      this.isCompletenessLoading = false;
    }
  }

  async loadApplicationList(page: number): Promise<void> {
    try {
      const res: any = await firstValueFrom(
        this.adminAnalyticsService.getApplicationCompleteness(page, 10)
      );

      this.list = res.data;
      this.activeCompletenessData = res.data.results;
    } catch (err) {
      console.error('Error fetching application completeness:', err);
    }
  }

  async loadApplicationSummary(): Promise<void> {
    try {
      const res: any = await firstValueFrom(
        this.adminAnalyticsService.getApplicationCompletenessSummary()
      );

      this.summaryData = res.data;
    } catch (err) {
      console.error('Error fetching completeness summary:', err);
    }
  }

  async loadWebServicesCompletenessData(): Promise<void> {
    this.isCompletenessLoading = true;

    try {
      await Promise.all([
        this.loadWebServiceSummary(),
        this.loadWebServiceList(0)
      ]);

    } finally {
      this.isCompletenessLoading = false;
    }
  }

  async loadWebServiceList(page: number): Promise<void> {
    try {
      const res: any = await firstValueFrom(
        this.adminAnalyticsService.getWebServicesCompleteness(page, 10)
      );

      this.list = res.data;
      this.activeCompletenessData = res.data.results;
    } catch (err) {
      console.error('Error fetching application completeness:', err);
    }
  }

  async loadWebServiceSummary(): Promise<void> {
    try {
      const res: any = await firstValueFrom(
        this.adminAnalyticsService.getWebServicesCompletenessSummary()
      );

      this.summaryData = res.data;
    } catch (err) {
      console.error('Error fetching completeness summary:', err);
    }
  }

  goToDetails(item: CompletenessData): void {
    const basePath = this.activeTab === 'applications'
      ? '/application/details'
      : '/web-services/details';

    this.router.navigate([basePath, item.uuid], {
      state: { missingFields: item.missingFields }
    });
  }

  async onHandlePage(newPage: number): Promise<void> {

    this.isCompletenessLoading = true;

    try {
      if (this.activeTab === 'applications') {
        await this.loadApplicationList(newPage);
      } else {
        await this.loadWebServiceList(newPage);
      }
    } finally {
      this.isCompletenessLoading = false;
    }
  }

}