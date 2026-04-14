import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApplicationApiService } from './application-api.service';
import { APP_CONFIG } from '../../../core/models/app.config.model';

describe('ApplicationApiService', () => {
  let service: ApplicationApiService;
  let httpMock: HttpTestingController;

  const mockConfig = { baseUrl: 'http://api.test.com' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApplicationApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: mockConfig }
      ]
    });

    service = TestBed.inject(ApplicationApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies no pending requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should fetch application list via POST with filters', () => {
  //   const page = 0;
  //   const mockFilters = { search: 'portal', filters: ['ACTIVE'] };
  //   const mockResponse = { data: [], total: 0 };

  //   service.getAppList(page, mockFilters).subscribe(res => {
  //     expect(res).toEqual(mockResponse);
  //   });

  //   const req = httpMock.expectOne(`${mockConfig.baseUrl}/applications?page=${page}`);
  //   expect(req.request.method).toBe('POST');
  //   expect(req.request.body).toEqual(mockFilters);
  //   req.flush(mockResponse);
  // });

  it('should fetch application details via GET', () => {
    const uuid = '123-uuid';
    service.getAppDetails(uuid).subscribe();

    const req = httpMock.expectOne(`${mockConfig.baseUrl}/applications/${uuid}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should fetch web services list for a specific app', () => {
    const uuid = 'app-123';
    const page = 1;
    service.getWebServicesList(uuid, page).subscribe();

    const req = httpMock.expectOne(`${mockConfig.baseUrl}/applications/web-services/${uuid}?size=5&page=${page}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should fetch version history list', () => {
    const uuid = 'app-123';
    const page = 2;
    service.getVersionHistoryList(uuid, page).subscribe();

    const req = httpMock.expectOne(`${mockConfig.baseUrl}/applications/${uuid}/versions?size=5&page=${page}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});