import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsEnComponent } from './terms-and-conditions-en.component';

describe('TermsAndConditionsEnComponent', () => {
  let component: TermsAndConditionsEnComponent;
  let fixture: ComponentFixture<TermsAndConditionsEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsEnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
