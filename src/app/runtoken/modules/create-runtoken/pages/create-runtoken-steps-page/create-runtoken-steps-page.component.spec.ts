import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRunTokenStepsPageComponent } from './create-runtoken-steps-page.component';
import {StepsModule} from 'primeng/steps';

xdescribe('CreateRunTokenStepsPageComponent', () => {
  let component: CreateRunTokenStepsPageComponent;
  let fixture: ComponentFixture<CreateRunTokenStepsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRunTokenStepsPageComponent ],
      imports: [StepsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRunTokenStepsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
