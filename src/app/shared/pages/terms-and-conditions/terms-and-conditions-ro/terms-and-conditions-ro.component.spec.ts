import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsRoComponent } from './terms-and-conditions-ro.component';

describe('TermsAndConditionsRoComponent', () => {
  let component: TermsAndConditionsRoComponent;
  let fixture: ComponentFixture<TermsAndConditionsRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
