import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyRoComponent } from './privacy-policy-ro.component';

describe('PrivacyPolicyRoComponent', () => {
  let component: PrivacyPolicyRoComponent;
  let fixture: ComponentFixture<PrivacyPolicyRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
