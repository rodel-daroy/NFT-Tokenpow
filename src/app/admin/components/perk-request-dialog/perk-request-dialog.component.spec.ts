import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerkRequestDialogComponent } from './perk-request-dialog.component';

xdescribe('PerkRequestDialogComponent', () => {
  let component: PerkRequestDialogComponent;
  let fixture: ComponentFixture<PerkRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerkRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerkRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
