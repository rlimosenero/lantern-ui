import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCodesModalComponent } from './status-codes-modal.component';

describe('StatusCodesModalComponent', () => {
  let component: StatusCodesModalComponent;
  let fixture: ComponentFixture<StatusCodesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCodesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusCodesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
