import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssetsPageComponent } from './create-assets-page.component';

xdescribe('CreateAssetsPageComponent', () => {
  let component: CreateAssetsPageComponent;
  let fixture: ComponentFixture<CreateAssetsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssetsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
