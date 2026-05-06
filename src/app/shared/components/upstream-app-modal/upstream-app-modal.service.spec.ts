import { TestBed } from '@angular/core/testing';

import { UpstreamAppModalService } from './upstream-app-modal.service';

describe('UpstreamAppModalService', () => {
  let service: UpstreamAppModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpstreamAppModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
