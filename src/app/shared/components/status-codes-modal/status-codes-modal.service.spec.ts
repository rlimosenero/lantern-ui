import { TestBed } from '@angular/core/testing';

import { StatusCodesModalService } from './status-codes-modal.service';

describe('StatusCodesModalService', () => {
  let service: StatusCodesModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusCodesModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
