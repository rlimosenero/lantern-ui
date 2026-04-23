import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebServicesFormComponent } from './web-services-form.component';

describe('WebServicesFormComponent', () => {
  let component: WebServicesFormComponent;
  let fixture: ComponentFixture<WebServicesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebServicesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebServicesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
