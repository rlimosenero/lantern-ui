import { TestBed } from '@angular/core/testing';

import { VersionFormsModalService } from './version-forms-modal.service';

describe('VersionFormsModalService', () => {
  let service: VersionFormsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionFormsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
