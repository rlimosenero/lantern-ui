import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { HighlightPipe } from '../../../shared/pipes/highlight/highlight.pipe';
import { filterData } from '../../../core/models/static';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { FilterOption } from '../../../core/models/interface';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { finalize } from 'rxjs';
import { ReplaceUnderscorePipe } from '../../../shared/pipes/replace-underscore/replace-underscore.pipe';
import { CamelCaseSeparatePipe } from '../../../shared/pipes/camel-case-separate/camel-case-separate.pipe';

@Component({
  selector: 'app-search',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    HighlightPipe,
    ButtonComponent,
    FormsModule,
    PaginationComponent,
    LoaderComponent,
    ReplaceUnderscorePipe,
    CamelCaseSeparatePipe
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',

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
    ]),
    trigger('heroAnimation', [
      transition(':leave', [
        // 1. Capture the current state explicitly
        style({
          opacity: 1,
          height: '*',
          marginTop: '5rem',
          marginBottom: '2rem',
          overflow: 'hidden'
        }),
        // 2. Animate opacity and height together with a "Step-down" approach
        animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({
          opacity: 0,
          height: '0px',
          marginTop: '0px',
          marginBottom: '0px',
          paddingTop: '0px',
          paddingBottom: '0px'
        }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        // Wait 300ms (almost the full duration of the hero exit)
        animate('500ms 300ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
})
export class SearchComponent implements OnInit {
  searchList: any = '';
  dataRes: any = [];

  isSearched = false;

  searchQuery: string = '';
  displayedColumns: string[] = ['type', 'name', 'match', 'view'];
  displayedColumnsGeneric: string[] = ['type', 'name', 'view'];

  isFilterExpanded = false;
  activeFilters: { [key: string]: string[] } = {};
  filterData: FilterOption[] = filterData;

  isLoading = true;
  isError = false;

  expandedRows: Set<number> = new Set();

  constructor(
    private searchService: SearchService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.searchList = this.mockList();
  }

  onHandlePage(newPage: number) {
    this.loadData(newPage);
  }

  search() {
    this.isSearched = true;
    this.dataRes = [];
    this.searchList = this.mockList();

    this.loadData(0);
  }

  mockList() {
    return new Array(10).fill({});
  }

  loadData(page: number) {
    this.isError = false;
    this.isLoading = true;
    let filters: string = this.formatFilter(this.activeFilters)

    this.searchService.getSearchList(this.searchQuery, filters, page).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data: any) => {
        this.dataRes = data.data;
        this.searchList = data.data.results

      },
      error: (err: any) => {
        this.isError = true;
        console.log('Error: ' + err);
      }
    })
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
  }

  formatFilter(activeFilters: { [key: string]: string[] }): string {
    const types = activeFilters['type'] || [];

    if (types.length === 0) return '';

    if (types.length > 1) return 'APPLICATION,WEB_SERVICE';

    const typeMap: Record<string, string> = {
      'Application': 'APPLICATION',
      'Web Service': 'WEB_SERVICE'
    };

    return typeMap[types[0]] || '';
  }

  openDetails(data: any) {

    const path = data.category === 'APPLICATION'
      ? '/app-details/' + data.uuid
      : '/web-service-details/' + data.uuid;


    this.router.navigate([path], {
      queryParams: { searchKeyword: this.searchQuery }
    });
  }

  toggleRow(index: number) {
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    } else {
      this.expandedRows.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedRows.has(index);
  }

}
