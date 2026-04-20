import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ApplicationApiService } from '../services/application-api.service';
import { TableListComponent } from '../../../shared/components/table-list/table-list.component';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { ApplicationSummary, FilterOption, PaginatedData, SearchResponse } from '../../../core/models/interface';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { ReplaceUnderscorePipe } from '../../../shared/pipes/replace-underscore/replace-underscore.pipe';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { finalize } from 'rxjs';
import { BreadcrumbService } from '../../../shared/components/breadcrumbs/breadcrumbs.service';

const APP_SEARCH_CACHE_KEY = 'app_search_state';

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
    FormsModule,
    ReplaceUnderscorePipe,
    LoaderComponent
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
  protected readonly String = String;

  // table columns
  displayedColumns: string[] = ['name', 'desc', 'version', 'status', 'options'];

  // filter tags
  statusOptions = ['Active', 'For Deprecation', 'Deprecated', 'For Retirement'];
  selectedStatuses: string[] = [];

  dataRes: any | [] = [];
  appList: ApplicationSummary[] | [] = [];

  isLoading = true;
  isError = false;

  constructor(
    private applicationApiService: ApplicationApiService,
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.breadcrumbService.clearAllOverrides();
    const hasCache = this.loadStateFromCache();

    if (hasCache) {
      this.isLoading = false;
    } else {
      this.appList = this.mockAppList();
      this.loadData(0);
    }

    this.fetchFilterOptions();

  }

  // initial placeholder
  mockAppList() {
    return new Array(10).fill({});
  }

  loadData(page: number = 0) {
    this.isError = false;
    this.isLoading = true;
    const formattedFilters = this.allSelectedTags.map(tag => ({
      key: tag.key,
      value: tag.value
    }));

    const payload = {
      search: this.searchQuery,
      filters: formattedFilters
    };

    this.applicationApiService.getAppList(page, payload).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.dataRes = data.data;
        this.appList = data.data.results;
        this.saveStateToCache();
      },
      error: (err) => {
        this.isError = true;
        console.error('Error: ' + err);
      }
    });
  }

  applyFilters() {
    this.closeAllFilters();
    this.isFilterExpanded = false;
    this.loadData(0);
  }

  onHandlePage(newPage: number) {
    // this.appList = [];
    this.loadData(newPage);
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

    // this.applyFilters();
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
    localStorage.removeItem(APP_SEARCH_CACHE_KEY);
    this.closeAllFilters();
    this.activeFilters = {};
    this.searchQuery = '';
    this.applyFilters();
  }

  fetchFilterOptions() {
    this.applicationApiService.getFilterOptions().subscribe({
      next: (res: any) => {
        this.filterData = res.data.map((filter: any) => ({
          ...filter,
          isOpen: false,
          searchTerm: ''
        }));
      },
      error: (err) => console.error(err)
    });
  }

  getFilteredOptions(filter: any): string[] {
    if (!filter.searchTerm) return filter.options[0];

    return filter.options[0].filter((option: string) =>
      option.toLowerCase().includes(filter.searchTerm.toLowerCase())
    );
  }

  closeAllFilters() {
    if (this.filterData) {
      this.filterData.forEach(filter => {
        filter.isOpen = false;

        filter.searchTerm = '';
      });
    }
  }

  // Save state to localStorage
  private saveStateToCache() {
    const state = {
      searchQuery: this.searchQuery,
      activeFilters: this.activeFilters,
      filterData: this.filterData,
      appList: this.appList,
      dataRes: this.dataRes
    };
    localStorage.setItem(APP_SEARCH_CACHE_KEY, JSON.stringify(state));
  }

  // Load state from localStorage
  private loadStateFromCache(): boolean {
    const cached = localStorage.getItem(APP_SEARCH_CACHE_KEY);
    if (cached) {
      const state = JSON.parse(cached);
      this.searchQuery = state.searchQuery || '';
      this.activeFilters = state.activeFilters || {};
      this.filterData = state.filterData || [];
      this.appList = state.appList || [];
      this.dataRes = state.dataRes || [];
      return true;
    }
    return false;
  }

  openFormPage(){
    this.router.navigate(['/application/new']);
    // this.router.navigate(['/application/new']);
  }

}
