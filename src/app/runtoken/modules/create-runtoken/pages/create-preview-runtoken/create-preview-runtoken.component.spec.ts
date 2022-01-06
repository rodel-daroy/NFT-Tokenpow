import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePreviewRunTokenComponent } from './create-preview-runtoken.component';
import {ButtonModule} from 'primeng/button';

xdescribe('CreatePreviewRunTokenComponent', () => {
  let component: CreatePreviewRunTokenComponent;
  let fixture: ComponentFixture<CreatePreviewRunTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePreviewRunTokenComponent ],
      imports: [ButtonModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePreviewRunTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
