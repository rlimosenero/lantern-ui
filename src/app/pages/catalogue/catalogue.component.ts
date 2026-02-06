import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

// 1. Define what a 'Service' looks like
interface WebService {
  name: string;
  status: 'Online' | 'Offline';
  deploymentDate: string;
  swaggerUrl: string;
}

@Component({
  selector: 'app-catalogue',
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatIconModule, 
    MatButtonModule, 
    MatChipsModule ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent {
  // 2. Define the columns to show in the table
  displayedColumns: string[] = ['name', 'status', 'deploymentDate', 'actions'];

  // 3. Sample data for your monitoring app
  dataSource: WebService[] = [
    { name: 'User-Auth-Service', status: 'Online', deploymentDate: '2026-02-01', swaggerUrl: 'https://api.lantern.com/auth/swagger' },
    { name: 'Payment-Gateway', status: 'Offline', deploymentDate: '2026-01-28', swaggerUrl: 'https://api.lantern.com/pay/swagger' },
    { name: 'Inventory-Worker', status: 'Online', deploymentDate: '2026-02-05', swaggerUrl: 'https://api.lantern.com/inv/swagger' }
  ];
}