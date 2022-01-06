import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksRoComponent } from './how-it-works-ro.component';

xdescribe('HowItWorksRoComponent', () => {
  let component: HowItWorksRoComponent;
  let fixture: ComponentFixture<HowItWorksRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
