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
import { ApplicationSummary, FilterOption, PaginatedData, SearchResponse } from '../../../core/models/interface';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

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
    PaginationComponent,
    FormsModule
  ],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss',

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
export class ApplicationComponent implements OnInit {
  public auth = inject(AuthService);
  searchQuery: string = '';
  isFilterExpanded = false;
  activeFilters: { [key: string]: string[] } = {};
  filterData: FilterOption[] = [];

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
    this.loadData(0);
    this.fetchFilterOptions();
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

    this.applicationApiService.getAppList(page, payload).subscribe({
      next: (data) => {
        this.dataRes = data.data;
        this.appList = data.data.results;
      },
      error: (err) => console.error('Error: ' + err)
    });
  }

  applyFilters() {
    this.loadData(0);
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

  toggleFilters() {
    this.isFilterExpanded = !this.isFilterExpanded;
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

    this.applyFilters();
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

  clearAll() {
    this.activeFilters = {};
    this.searchQuery = '';
    this.applyFilters();
  }

  fetchFilterOptions() {
    this.filterData = this.applicationApiService.getFilterOptions();
    console.log(this.filterData);
  }
}
