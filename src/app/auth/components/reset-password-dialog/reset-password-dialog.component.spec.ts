import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordDialogComponent } from './reset-password-dialog.component';

xdescribe('ResetPasswordDialogComponent', () => {
  let component: ResetPasswordDialogComponent;
  let fixture: ComponentFixture<ResetPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPasswordDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
