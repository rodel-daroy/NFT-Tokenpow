import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelltokenListComponent } from './selltoken-list.component';

xdescribe('SelltokenListComponent', () => {
  let component: SelltokenListComponent;
  let fixture: ComponentFixture<SelltokenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelltokenListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelltokenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
