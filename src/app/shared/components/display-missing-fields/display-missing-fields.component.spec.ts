import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMissingFieldsComponent } from './display-missing-fields.component';

describe('DisplayMissingFieldsComponent', () => {
  let component: DisplayMissingFieldsComponent;
  let fixture: ComponentFixture<DisplayMissingFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayMissingFieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayMissingFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
