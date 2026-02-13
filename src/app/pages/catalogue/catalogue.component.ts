import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card'; // <--- 1. Add this import
import { MonitoringService } from '../../services/monitoring.service';
import { WebServicesApiServiceService } from '../../services/web-services-api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent implements OnInit {
  webServicesList: any = [];
  displayedColumns: string[] = ['name', 'desc', 'version', 'status', 'options'];

  constructor(
    private webServicesApiService: WebServicesApiServiceService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getWebServicesList();
  }

  getWebServicesList() {
    this.webServicesList = this.webServicesApiService.getWebServicesList();
    console.log(this.webServicesList)
  }



  private monitoringService = inject(MonitoringService);
  // displayedColumns: string[] = ['name', 'status', 'lastDeployment', 'actions'];
  dataSource = this.monitoringService.services;

  toggleService(name: string) {
    this.monitoringService.toggleStatus(name);
  }
}