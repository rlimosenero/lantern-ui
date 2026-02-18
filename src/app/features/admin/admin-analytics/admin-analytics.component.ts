import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MonitoringService } from '../services/monitoring.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, MatIconModule],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss'
})
export class AdminAnalyticsComponent {
  private monitoringService = inject(MonitoringService);

  // Map service signals to local display objects
  stats = computed(() => [
    { 
      title: 'Total Services', 
      value: this.monitoringService.totalCount(), 
      icon: 'hub', 
      color: '#3f51b5' 
    },
    { 
      title: 'Systems Online', 
      value: this.monitoringService.onlineCount(), 
      icon: 'check_circle', 
      color: '#2e7d32' 
    },
    { 
      title: 'Critical Alerts', 
      value: this.monitoringService.alertCount(), 
      icon: 'report_problem', 
      color: '#d32f2f' 
    }
  ]);
}