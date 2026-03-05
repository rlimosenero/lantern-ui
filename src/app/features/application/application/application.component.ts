import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ApplicationApiService } from '../services/application-api-service.service';
import { TableListComponent } from '../../../shared/components/table-list/table-list.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ApplicationSummary, PaginatedData, SearchResponse } from '../../../core/models/interface';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-application',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    TableListComponent,
    ButtonComponent,
    PaginationComponent
  ],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss',

  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden', margin: '0' })),
      state('expanded', style({ height: '*', opacity: 1, margin: '16px 0 0 0' })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ]),
    ]),
    trigger('tagAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
})
export class ApplicationComponent implements OnInit {
  public auth = inject(AuthService);
  isFilterExpanded = false;
  isStatusDropdownOpen = false;

  // table columns
  displayedColumns: string[] = ['name', 'desc', 'version', 'status', 'options'];

  // filter tags
  statusOptions = ['Active', 'For Deprecation', 'Deprecated', 'For Retirement'];
  selectedStatuses: string[] = [];

  dataRes: any | [] = [];
  appList: ApplicationSummary[] | [] = [];

  constructor(
    private applicationApiService: ApplicationApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchAppDetails();
  }

  fetchAppDetails() {
    this.applicationApiService.getAppList(0).subscribe({
      next: (data) => {
        this.dataRes = data.data;
        this.appList = data.data.results;
      },
      error: (err) => {
        console.log('Error: ' + err);
      }
    })
  }

onHandlePage(newPage: number) {
  this.appList = []; 
  
  this.applicationApiService.getAppList(newPage).subscribe({
    next: (res) => {
      this.dataRes = res.data;
      this.appList = res.data.results;
    },
    error: (err) => console.error(err)
  });
}

  // fetchAppDetails() {
  //   this.appList = this.applicationApiService.getAppList()[0].data.results;
  // }

  toggleFilters() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  toggleStatus(status: string) {
    const index = this.selectedStatuses.indexOf(status);
    if (index > -1) {
      this.selectedStatuses.splice(index, 1); // Remove if exists
    } else {
      this.selectedStatuses.push(status); // Add if new
    }
  }

  removeStatus(status: string) {
    this.selectedStatuses = this.selectedStatuses.filter(s => s !== status);
  }
}
