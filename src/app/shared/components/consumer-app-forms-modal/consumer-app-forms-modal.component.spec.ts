import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerAppFormsModalComponent } from './consumer-app-forms-modal.component';

describe('ConsumerAppFormsModalComponent', () => {
  let component: ConsumerAppFormsModalComponent;
  let fixture: ComponentFixture<ConsumerAppFormsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumerAppFormsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerAppFormsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
