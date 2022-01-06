import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAssetsPageComponent } from './modify-assets-page.component';

xdescribe('CreateAssetsPageComponent', () => {
  let component: ModifyAssetsPageComponent;
  let fixture: ComponentFixture<ModifyAssetsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyAssetsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAssetsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
