import { TestBed } from '@angular/core/testing';

import { BreadcrumbService } from './breadcrumbs.service';

describe('BreadcrumbsService', () => {
  let service: BreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
