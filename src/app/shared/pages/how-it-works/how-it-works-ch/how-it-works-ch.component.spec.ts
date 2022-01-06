import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksChComponent } from './how-it-works-ch.component';

xdescribe('HowItWorksChComponent', () => {
  let component: HowItWorksChComponent;
  let fixture: ComponentFixture<HowItWorksChComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksChComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksChComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
