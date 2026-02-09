import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MonitoringService } from '../../services/monitoring.service';

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
export class ApplicationComponent {
private monitoringService = inject(MonitoringService);
  displayedColumns: string[] = ['name', 'desc', 'version', 'status', 'options'];
  dataSource = this.monitoringService.services;
}
