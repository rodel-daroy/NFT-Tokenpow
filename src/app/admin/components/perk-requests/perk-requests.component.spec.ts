import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerkRequestsComponent } from './perk-requests.component';

xdescribe('PerkRequestsComponent', () => {
  let component: PerkRequestsComponent;
  let fixture: ComponentFixture<PerkRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerkRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerkRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
