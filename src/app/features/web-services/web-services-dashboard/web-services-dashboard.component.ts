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
import { ApplicationSummary, FilterOption, TableItem } from '../../../core/models/interface';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-web-services-dashboard',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    TableListComponent,
    PaginationComponent,
    ButtonComponent,
    FormsModule
  ],
  templateUrl: './web-services-dashboard.component.html',
  styleUrl: './web-services-dashboard.component.scss',

  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden', margin: '0' })),
      state('expanded', style({ height: '*', opacity: 1, margin: '8px 0 0 0' })),
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
export class WebServicesDashboardComponent {
  webServicesList: ApplicationSummary[] | [] = [];
  displayedColumns: string[] = ['name', 'desc', 'version', 'status', 'options'];

  isFilterExpanded = false;
  activeFilters: { [key: string]: string[] } = {};
  filterData: FilterOption[] = [];
  searchQuery: string = '';

  dataRes: any | [] = [];

  constructor(
    private webServicesApiService: WebServicesApiServiceService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loadData(0)
    this.fetchFilterOptions();
  }

  onHandlePage(newPage: number) {
    this.webServicesList = [];
    this.loadData(newPage)
  }


  toggleFilters() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  toggleDropdown(selectedFilter: any) {
    const willOpen = !selectedFilter.isOpen;
    this.filterData.forEach(f => f.isOpen = false);
    selectedFilter.isOpen = willOpen;
  }

  toggleFilter(key: string, option: string) {
    if (!this.activeFilters[key]) {
      this.activeFilters[key] = [];
    }

    const index = this.activeFilters[key].indexOf(option);
    if (index > -1) {
      this.activeFilters[key].splice(index, 1);
    } else {
      this.activeFilters[key].push(option);
    }

    if (this.activeFilters[key].length === 0) {
      delete this.activeFilters[key];
    }
  }

  isSelected(key: string, option: string): boolean {
    return this.activeFilters[key]?.includes(option) ?? false;
  }

  get allSelectedTags() {
    const tags: { key: string, value: string }[] = [];
    Object.keys(this.activeFilters).forEach(key => {
      this.activeFilters[key].forEach(value => {
        tags.push({ key, value });
      });
    });
    return tags;
  }

  applyFilters() {
    this.loadData(0);
  }

  loadData(page: number = 0) {
    const formattedFilters = this.allSelectedTags.map(tag => ({
      key: tag.key,
      value: tag.value
    }));


    const payload = {
      search: this.searchQuery,
      filters: formattedFilters
    };


    this.webServicesApiService.getWebServicesList(page, payload).subscribe({
      next: (data: any) => {
        this.dataRes = data.data;
        this.webServicesList = data.data.results;
      },
      error: (err: any) => console.error('Error fetching data:', err)
    });
  }

  clearAll() {
    this.activeFilters = {};
    this.searchQuery = '';
    this.applyFilters();
  }

  fetchFilterOptions() {
    this.webServicesApiService.getFilterOptions().subscribe({
      next: (res: any) => {
        this.filterData = res.data;

      },
      error: (err) => console.error(err)
    });
  }

}
