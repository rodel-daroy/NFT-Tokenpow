import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyRunTokenPageComponent } from './modify-runtoken-page.component';

xdescribe('CreateRunTokenPageComponent', () => {
  let component: ModifyRunTokenPageComponent;
  let fixture: ComponentFixture<ModifyRunTokenPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyRunTokenPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyRunTokenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
