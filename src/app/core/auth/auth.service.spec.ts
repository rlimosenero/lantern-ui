import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { APP_CONFIG } from '../models/app.config.model';
import { BreadcrumbService } from '../../shared/components/breadcrumbs/breadcrumbs.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let breadcrumbService: jasmine.SpyObj<BreadcrumbService>;

  const mockConfig = { baseUrl: 'http://api.test.com' };

  // Helper to create a dummy JWT (header.payload.signature)
  const createMockToken = (payload: object) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const encodedPayload = btoa(JSON.stringify(payload));
    return `${header}.${encodedPayload}.signature`;
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const bcSpy = jasmine.createSpyObj('BreadcrumbService', ['clearAllOverrides']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: mockConfig },
        { provide: Router, useValue: routerSpy },
        { provide: BreadcrumbService, useValue: bcSpy }
      ]
    });

    // clear localStorage before each test
    localStorage.clear();
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    breadcrumbService = TestBed.inject(BreadcrumbService) as jasmine.SpyObj<BreadcrumbService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user, store token, and navigate to search', () => {
    const mockToken = createMockToken({ sub: 'john_doe' });
    
    service.login(mockToken);

    expect(localStorage.getItem('lantern_jwt')).toBe(mockToken);
    expect(service.currentUser()?.username).toBe('john_doe');
    expect(service.isAuthenticated()).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should clear everything on logout', () => {
    localStorage.setItem('lantern_jwt', 'some-token');
    localStorage.setItem('app_search_state', 'some-data');

    service.logout();

    expect(localStorage.getItem('lantern_jwt')).toBeNull();
    expect(localStorage.getItem('app_search_state')).toBeNull();
    expect(breadcrumbService.clearAllOverrides).toHaveBeenCalled();
    expect(service.currentUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should authenticate via API and login on success', () => {
    const credentials = { username: 'test', password: '123' };
    const mockToken = createMockToken({ sub: 'test_user' });
    const mockResponse = {
      flag: 'S',
      data: { token: mockToken }
    };

    service.authenticate(credentials).subscribe();

    const req = httpMock.expectOne(`${mockConfig.baseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/search']);
  });

  it('should hydrate user from localStorage on init', () => {
    const mockToken = createMockToken({ sub: 'persistent_user' });
    localStorage.setItem('lantern_jwt', mockToken);

    const newService = TestBed.createComponent(AuthService as any); 
  });
});