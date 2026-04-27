import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionFormsModalComponent } from './version-forms-modal.component';

describe('VersionFormsModalComponent', () => {
  let component: VersionFormsModalComponent;
  let fixture: ComponentFixture<VersionFormsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionFormsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionFormsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
