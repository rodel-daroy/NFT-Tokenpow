import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let button: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    button = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should disabled when disabled is true', () => {
    button.disabled = true;
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('.button'));
    expect(buttonEl.nativeElement.disabled).toBeTruthy();
  });

  // TODO: add tests for hover, outlined, filled, click event

  it('should create', () => {
    expect(button).toBeTruthy();
  });
});
