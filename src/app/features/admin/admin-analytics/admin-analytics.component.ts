import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { KeyValuePipe } from '@angular/common';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AdminAnalyticsService } from './admin-analytics.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    KeyValuePipe,
    LoaderComponent
  ],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss'
})
export class AdminAnalyticsComponent implements OnInit {
  activeTab: 'applications' | 'webServices' = 'applications';
  isCompletenessLoading = false;

  summaryData = {
    // "totalApplications": 10,
    // "overallCompleteness": 78.00,
    "applicationsAddedThisMonth": 2,
    "completenessChangeVsLastMonth": 4.20,
    "fullyComplete": 4,
    "needsAttention": 3
  }

  applications = [
    {
      name: 'User Authentication API',
      overallCompletenessRate: 100,
      mandatoryCompletenessRate: 100,
      status: 'COMPLETE'
    },
    {
      name: 'Payment Gateway',
      overallCompletenessRate: 93.33,
      mandatoryCompletenessRate: 80,
      status: 'PARTIAL'
    }
  ];

  webServices = [
    {
      name: 'User Service',
      overallCompletenessRate: 95,
      mandatoryCompletenessRate: 90,
      status: 'COMPLETE'
    },
    {
      name: 'Payment Service',
      overallCompletenessRate: 72,
      mandatoryCompletenessRate: 65,
      status: 'PARTIAL'
    }
  ];

  constructor(
    private adminAnalyticsService: AdminAnalyticsService,
  ) { }

  ngOnInit() {
    this.loadCompletenessData();
    this.loadApplicationList();
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
  }

  getActiveCompletenessData() {
    return this.activeTab === 'applications'
      ? this.applications
      : this.webServices;
  }

  loadCompletenessData() {
    this.adminAnalyticsService.getCompletenessSummary().subscribe({
      next: (res) => {
        console.log('summary')
        console.log(res);
      },
      error: (err) => {
        console.error('Error fetching completeness summary:', err);
      }
    });
  }

  loadApplicationList() {
    this.adminAnalyticsService.getApplicationCompleteness().subscribe({
      next: (res) => {
        console.log('applicationlist')
        console.log(res)
      },
      error: (err) => {
        console.error('Error fetching application completeness:', err);
      }
    });
  }

}