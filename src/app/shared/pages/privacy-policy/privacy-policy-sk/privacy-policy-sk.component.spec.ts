import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicySkComponent } from './privacy-policy-sk.component';

xdescribe('PrivacyPolicySkComponent', () => {
  let component: PrivacyPolicySkComponent;
  let fixture: ComponentFixture<PrivacyPolicySkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicySkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicySkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
