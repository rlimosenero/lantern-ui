import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFieldsModalComponent } from './data-fields-modal.component';

describe('DataFieldsModalComponent', () => {
  let component: DataFieldsModalComponent;
  let fixture: ComponentFixture<DataFieldsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataFieldsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataFieldsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
