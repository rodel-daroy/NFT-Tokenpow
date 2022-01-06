import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyButtonComponent } from './money-button.component';

xdescribe('MoneyButtonComponent', () => {
  let component: MoneyButtonComponent;
  let fixture: ComponentFixture<MoneyButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
