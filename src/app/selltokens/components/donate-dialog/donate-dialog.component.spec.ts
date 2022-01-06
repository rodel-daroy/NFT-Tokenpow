import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateDialogComponent } from './donate-dialog.component';

xdescribe('DonateDialogComponent', () => {
  let component: DonateDialogComponent;
  let fixture: ComponentFixture<DonateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
