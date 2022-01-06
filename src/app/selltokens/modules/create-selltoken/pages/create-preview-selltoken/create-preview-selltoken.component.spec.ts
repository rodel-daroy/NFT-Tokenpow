import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePreviewSelltokenComponent } from './create-preview-selltoken.component';
import {ButtonModule} from 'primeng/button';

xdescribe('CreatePreviewselltokenComponent', () => {
  let component: CreatePreviewSelltokenComponent;
  let fixture: ComponentFixture<CreatePreviewSelltokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePreviewSelltokenComponent ],
      imports: [ButtonModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePreviewSelltokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
