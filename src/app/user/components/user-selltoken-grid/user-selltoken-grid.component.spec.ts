import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelltokenGridComponent } from './user-selltoken-grid.component';

xdescribe('UserSelltokenGridComponent', () => {
  let component: UserSelltokenGridComponent;
  let fixture: ComponentFixture<UserSelltokenGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSelltokenGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSelltokenGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
