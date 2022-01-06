import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyEnComponent } from './privacy-policy-en.component';

xdescribe('PrivacyPolicyEnComponent', () => {
  let component: PrivacyPolicyEnComponent;
  let fixture: ComponentFixture<PrivacyPolicyEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyEnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
