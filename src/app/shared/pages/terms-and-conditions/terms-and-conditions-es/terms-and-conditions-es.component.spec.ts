import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAndConditionsEsComponent } from './terms-and-conditions-es.component';

describe('TermsAndConditionsEsComponent', () => {
  let component: TermsAndConditionsEsComponent;
  let fixture: ComponentFixture<TermsAndConditionsEsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsAndConditionsEsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
