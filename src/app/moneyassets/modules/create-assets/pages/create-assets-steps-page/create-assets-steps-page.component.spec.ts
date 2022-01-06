import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssetsStepsPageComponent } from './create-assets-steps-page.component';
import {StepsModule} from 'primeng/steps';

xdescribe('CreateAssetsStepsPageComponent', () => {
  let component: CreateAssetsStepsPageComponent;
  let fixture: ComponentFixture<CreateAssetsStepsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAssetsStepsPageComponent ],
      imports: [StepsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssetsStepsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
