import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWithdrawDialogComponent } from './user-withdraw-dialog.component';

xdescribe('UserWithdrawDialogComponent', () => {
  let component: UserWithdrawDialogComponent;
  let fixture: ComponentFixture<UserWithdrawDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWithdrawDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
