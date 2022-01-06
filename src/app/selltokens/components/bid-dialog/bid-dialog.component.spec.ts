import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidDialogComponent } from './bid-dialog.component';

xdescribe('BidDialogComponent', () => {
  let component: BidDialogComponent;
  let fixture: ComponentFixture<BidDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
