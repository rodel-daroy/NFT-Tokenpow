import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyChComponent } from './privacy-policy-ch.component';

xdescribe('PrivacyPolicyChComponent', () => {
  let component: PrivacyPolicyChComponent;
  let fixture: ComponentFixture<PrivacyPolicyChComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyChComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyChComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
