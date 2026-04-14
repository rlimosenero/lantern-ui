import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { SearchService } from '../services/search.service';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockSearchResponse = {
    data: {
      results: [{ uuid: '1', name: 'App 1', category: 'APPLICATION' }],
      total: 1
    }
  };

  beforeEach(async () => {
    const sSpy = jasmine.createSpyObj('SearchService', ['getSearchList']);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SearchComponent, 
        NoopAnimationsModule // Required because component has animations
      ],
      providers: [
        { provide: SearchService, useValue: sSpy },
        { provide: Router, useValue: rSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    searchServiceSpy = TestBed.inject(SearchService) as jasmine.SpyObj<SearchService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Clear localStorage before each test to prevent state pollution
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // describe('Search and Data Loading', () => {
  //   it('should load data and save state on search', () => {
  //     searchServiceSpy.getSearchList.and.returnValue(of(mockSearchResponse));
  //     component.searchQuery = 'test';
      
  //     component.search();

  //     expect(component.isLoading).toBeFalse();
  //     expect(component.searchList.length).toBe(1);
  //     expect(localStorage.getItem('global_search_state')).toBeTruthy();
  //   });

  //   it('should handle errors during data loading', () => {
  //     searchServiceSpy.getSearchList.and.returnValue(throwError(() => new Error('API Error')));
      
  //     component.loadData(0);

  //     expect(component.isError).toBeTrue();
  //     expect(component.isLoading).toBeFalse();
  //   });
  // });

  describe('Filter Logic', () => {
    it('should toggle filter options and format them correctly', () => {
      component.toggleFilter('type', 'Application');
      expect(component.activeFilters['type']).toContain('Application');

      const formatted = component.formatFilter(component.activeFilters);
      expect(formatted).toBe('APPLICATION');

      component.toggleFilter('type', 'Application'); // Remove it
      expect(component.activeFilters['type']).toBeUndefined();
    });

    it('should clear all filters', () => {
      component.activeFilters = { type: ['Application'], status: ['Active'] };
      component.clearAll();
      expect(Object.keys(component.activeFilters).length).toBe(0);
    });
  });

  describe('Navigation', () => {
    it('should navigate to application details with search keyword', () => {
      const mockData = { category: 'APPLICATION', uuid: '123' };
      component.searchQuery = 'query';
      
      component.openDetails(mockData);

      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/application/details/123'],
        { queryParams: { searchKeyword: 'query' } }
      );
    });
  });

  describe('State Management', () => {
    it('should load state from localStorage on init', () => {
      const savedState = {
        searchQuery: 'cached query',
        activeFilters: {},
        isSearched: true,
        searchList: [{ name: 'Cached App' }],
        dataRes: {},
        expandedRows: [1]
      };
      localStorage.setItem('global_search_state', JSON.stringify(savedState));

      // Re-trigger ngOnInit
      component.ngOnInit();

      expect(component.searchQuery).toBe('cached query');
      expect(component.isExpanded(1)).toBeTrue();
    });
  });
});