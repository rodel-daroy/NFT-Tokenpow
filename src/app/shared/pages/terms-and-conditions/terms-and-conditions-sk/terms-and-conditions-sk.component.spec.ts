import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsSkComponent } from './terms-and-conditions-sk.component';

describe('TermsAndConditionsSkComponent', () => {
  let component: TermsAndConditionsSkComponent;
  let fixture: ComponentFixture<TermsAndConditionsSkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsSkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsSkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
