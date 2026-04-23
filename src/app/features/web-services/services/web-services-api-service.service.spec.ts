import { TestBed } from '@angular/core/testing';

import { WebServicesApiServiceService } from './web-services-api.service';

describe('WebServicesApiServiceService', () => {
  let service: WebServicesApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebServicesApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
