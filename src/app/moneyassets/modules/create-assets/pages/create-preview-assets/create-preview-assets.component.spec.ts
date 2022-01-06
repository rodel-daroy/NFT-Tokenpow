import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePreviewAssetComponent } from './create-preview-assets.component';
import {ButtonModule} from 'primeng/button';

xdescribe('CreatePreviewAssetComponent', () => {
  let component: CreatePreviewAssetComponent;
  let fixture: ComponentFixture<CreatePreviewAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePreviewAssetComponent ],
      imports: [ButtonModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePreviewAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
