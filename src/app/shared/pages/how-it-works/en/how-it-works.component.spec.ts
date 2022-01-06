import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksComponent } from './how-it-works.component';
import {ButtonModule} from 'primeng/button';

xdescribe('HowItWorksComponent', () => {
  let component: HowItWorksComponent;
  let fixture: ComponentFixture<HowItWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HowItWorksComponent ],
      imports: [ButtonModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
