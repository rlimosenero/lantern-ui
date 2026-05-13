import { TestBed } from '@angular/core/testing';

import { UpstreamAppFormsModalService } from './upstream-app-forms-modal.service';

describe('UpstreamAppFormsModalService', () => {
  let service: UpstreamAppFormsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpstreamAppFormsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
