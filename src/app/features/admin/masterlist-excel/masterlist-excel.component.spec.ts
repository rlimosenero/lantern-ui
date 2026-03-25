import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterlistExcelComponent } from './masterlist-excel.component';

describe('MasterlistExcelComponent', () => {
  let component: MasterlistExcelComponent;
  let fixture: ComponentFixture<MasterlistExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterlistExcelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterlistExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
