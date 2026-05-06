import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpstreamAppModalComponent } from './upstream-app-modal.component';

describe('UpstreamAppModalComponent', () => {
  let component: UpstreamAppModalComponent;
  let fixture: ComponentFixture<UpstreamAppModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpstreamAppModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpstreamAppModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
