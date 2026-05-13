import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpstreamAppFormsModalComponent } from './upstream-app-forms-modal.component';

describe('UpstreamAppFormsModalComponent', () => {
  let component: UpstreamAppFormsModalComponent;
  let fixture: ComponentFixture<UpstreamAppFormsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpstreamAppFormsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpstreamAppFormsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
