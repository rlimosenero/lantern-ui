import { TestBed } from '@angular/core/testing';

import { ConsumerAppFormsModalService } from './consumer-app-forms-modal.service';

describe('ConsumerAppFormsModalService', () => {
  let service: ConsumerAppFormsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumerAppFormsModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
