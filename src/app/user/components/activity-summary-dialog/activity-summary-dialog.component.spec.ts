import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySummaryDialogComponent } from './activity-summary-dialog.component';

xdescribe('ActivitySummaryDialogComponent', () => {
  let component: ActivitySummaryDialogComponent;
  let fixture: ComponentFixture<ActivitySummaryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitySummaryDialogComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySummaryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
