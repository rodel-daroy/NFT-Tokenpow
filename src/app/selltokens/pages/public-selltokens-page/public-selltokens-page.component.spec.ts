import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicSelltokensPageComponent } from './public-selltokens-page.component';

xdescribe('PublicSelltokensPageComponent', () => {
  let component: PublicSelltokensPageComponent;
  let fixture: ComponentFixture<PublicSelltokensPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicSelltokensPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicSelltokensPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
