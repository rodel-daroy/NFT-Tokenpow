import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSelltokenStepsPageComponent } from './create-selltoken-steps-page.component';
import {StepsModule} from 'primeng/steps';

xdescribe('CreateSelltokenStepsPageComponent', () => {
  let component: CreateSelltokenStepsPageComponent;
  let fixture: ComponentFixture<CreateSelltokenStepsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSelltokenStepsPageComponent ],
      imports: [StepsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSelltokenStepsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
