import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsChComponent } from './terms-and-conditions-ch.component';

describe('TermsAndConditionsChComponent', () => {
  let component: TermsAndConditionsChComponent;
  let fixture: ComponentFixture<TermsAndConditionsChComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsChComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsChComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
