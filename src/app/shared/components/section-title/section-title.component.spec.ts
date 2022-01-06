import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTitleComponent } from './section-title.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('SectionTitleComponent', () => {
  let component: SectionTitleComponent;
  let fixture: ComponentFixture<SectionTitleComponent>;
  let debugImage: DebugElement;
  let debugMainText: DebugElement;
  let debugSecondaryText: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionTitleComponent);
    component = fixture.componentInstance;

    component.mainText = 'Main text';
    component.secondaryText = 'Secondary text';

    debugImage = fixture.debugElement.query(By.css('.avatar'));
    debugMainText = fixture.debugElement.query(By.css('.mainText'));
    debugSecondaryText = fixture.debugElement.query(By.css('.bold'));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input props', () => {
    expect(debugMainText.nativeElement.textContent).toBe('Main text');
    expect(debugSecondaryText.nativeElement.textContent).toBe(' Secondary text');
    expect(debugImage).toBeNull();
  });
});
