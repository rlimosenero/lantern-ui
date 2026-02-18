import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebServicesDashboardComponent } from './web-services-dashboard.component';

describe('WebServicesDashboardComponent', () => {
  let component: WebServicesDashboardComponent;
  let fixture: ComponentFixture<WebServicesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebServicesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebServicesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
