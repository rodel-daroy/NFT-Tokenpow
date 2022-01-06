import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDetailContentInfoComponent } from './single-detail-content-info.component';

xdescribe('SingleDetailContentInfoComponent', () => {
  let component: SingleDetailContentInfoComponent;
  let fixture: ComponentFixture<SingleDetailContentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDetailContentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDetailContentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
