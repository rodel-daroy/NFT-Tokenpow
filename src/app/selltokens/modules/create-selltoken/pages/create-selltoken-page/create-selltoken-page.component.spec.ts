import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSelltokenPageComponent } from './create-selltoken-page.component';

xdescribe('CreateSelltokenPageComponent', () => {
  let component: CreateSelltokenPageComponent;
  let fixture: ComponentFixture<CreateSelltokenPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSelltokenPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSelltokenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
