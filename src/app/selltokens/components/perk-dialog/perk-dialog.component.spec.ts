import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerkDialogComponent } from './perk-dialog.component';

xdescribe('PerkDialogComponent', () => {
  let component: PerkDialogComponent;
  let fixture: ComponentFixture<PerkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
