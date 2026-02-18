import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebServicesDetailsComponent } from './web-services-details.component';

describe('WebServicesDetailsComponent', () => {
  let component: WebServicesDetailsComponent;
  let fixture: ComponentFixture<WebServicesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebServicesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebServicesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
