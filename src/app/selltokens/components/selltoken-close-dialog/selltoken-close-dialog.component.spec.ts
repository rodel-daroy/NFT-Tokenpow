import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelltokenCloseDialogComponent } from './selltoken-close-dialog.component';

xdescribe('SelltokenCloseDialogComponent', () => {
  let component: SelltokenCloseDialogComponent;
  let fixture: ComponentFixture<SelltokenCloseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelltokenCloseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelltokenCloseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
