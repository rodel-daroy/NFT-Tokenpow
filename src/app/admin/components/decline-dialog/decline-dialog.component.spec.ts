import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineDialogComponent } from './decline-dialog.component';
import {ButtonModule} from 'primeng/button';

xdescribe('DeclineDialogComponent', () => {
  let component: DeclineDialogComponent;
  let fixture: ComponentFixture<DeclineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeclineDialogComponent ],
      imports: [ButtonModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeclineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
