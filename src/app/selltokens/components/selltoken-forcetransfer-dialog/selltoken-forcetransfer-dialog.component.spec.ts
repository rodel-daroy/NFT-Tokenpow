import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelltokenForceTransferDialogComponent } from './selltoken-forcetransfer-dialog.component';

xdescribe('SelltokenForceTransferDialogComponent', () => {
  let component: SelltokenForceTransferDialogComponent;
  let fixture: ComponentFixture<SelltokenForceTransferDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelltokenForceTransferDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelltokenForceTransferDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
