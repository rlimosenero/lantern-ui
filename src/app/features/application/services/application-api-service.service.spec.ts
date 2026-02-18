import { TestBed } from '@angular/core/testing';
import { ApplicationApiServiceService } from './application-api-service.service';

describe('ApplicationApiServiceService', () => {
  let service: ApplicationApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
