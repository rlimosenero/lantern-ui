import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-analytics',
  imports: [CommonModule, MatGridListModule, MatCardModule, MatIconModule],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.scss'
})
export class AdminAnalyticsComponent {
  // Sample data for Project Lantern stats
  stats = [
    { title: 'Total Services', value: '12', icon: 'settings_input_component', color: '#3f51b5' },
    { title: 'Systems Online', value: '11', icon: 'check_circle', color: 'green' },
    { title: 'Critical Alerts', value: '1', icon: 'warning', color: '#d32f2f' }
  ];
}