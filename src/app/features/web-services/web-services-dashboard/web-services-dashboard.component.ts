import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MonitoringService } from '../../admin/services/monitoring.service';
import { WebServicesApiServiceService } from '../services/web-services-api-service.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TableListComponent } from '../../../shared/components/table-list/table-list.component';
import { TableItem } from '../../../core/models/interface';

@Component({
  selector: 'app-web-services-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    TableListComponent
  ],
  templateUrl: './web-services-dashboard.component.html',
  styleUrl: './web-services-dashboard.component.scss',
})
export class WebServicesDashboardComponent {
  webServicesList: TableItem[] | [] = [];
  displayedColumns: string[] = ['name', 'desc', 'version', 'status', 'options'];

  constructor(
    private webServicesApiService: WebServicesApiServiceService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getWebServicesList();
  }

  getWebServicesList() {
    this.webServicesList = this.webServicesApiService.getWebServicesList()[0].data.results;
    console.log(this.webServicesList)
  }



  private monitoringService = inject(MonitoringService);
  // displayedColumns: string[] = ['name', 'status', 'lastDeployment', 'actions'];
  dataSource = this.monitoringService.services;

  toggleService(name: string) {
    this.monitoringService.toggleStatus(name);
  }
}
