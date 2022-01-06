import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksEsComponent } from './how-it-works-es.component';

xdescribe('HowItWorksEsComponent', () => {
  let component: HowItWorksEsComponent;
  let fixture: ComponentFixture<HowItWorksEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksEsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
