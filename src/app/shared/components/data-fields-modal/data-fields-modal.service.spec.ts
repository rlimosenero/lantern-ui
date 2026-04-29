import { TestBed } from '@angular/core/testing';

import { DataFieldsModalService } from './data-fields-modal.service';

describe('DataFieldsModalService', () => {
  let service: DataFieldsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFieldsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
