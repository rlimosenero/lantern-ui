import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SearchService } from './search.service';
import { APP_CONFIG } from '../../../core/models/app.config.model';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  // Mock configuration
  const mockConfig = {
    baseUrl: 'http://api.test.com'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: mockConfig } // Inject our mock config
      ],
    });

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure no outstanding http calls remain
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct URL with query parameters', () => {
    const keyword = 'portal';
    const category = 'web-service';
    const page = 0;

    service.getSearchList(keyword, category, page).subscribe();

    // Verify the URL is constructed exactly as defined in your service
    const req = httpMock.expectOne(
      `${mockConfig.baseUrl}/catalog/search?keyword=${keyword}&categories=${category}&page=${page}&size=10`
    );

    expect(req.request.method).toBe('GET');
    
    // Flush the request with a dummy response
    req.flush({ data: [], total: 0 });
  });
});