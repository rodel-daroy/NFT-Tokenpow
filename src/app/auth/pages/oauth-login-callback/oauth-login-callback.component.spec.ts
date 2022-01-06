import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthLoginCallbackComponent } from './oauth-login-callback.component';

xdescribe('OauthLoginCallbackComponent', () => {
  let component: OauthLoginCallbackComponent;
  let fixture: ComponentFixture<OauthLoginCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OauthLoginCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthLoginCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
