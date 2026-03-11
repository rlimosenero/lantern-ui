import { TestBed } from '@angular/core/testing';

import { VersionModalService } from './version-modal.service';

describe('VersionModalService', () => {
  let service: VersionModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
