import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApproveSelltokenComponent } from './create-approve-selltoken.component';

xdescribe('CreateApproveSelltokenComponent', () => {
  let component: CreateApproveSelltokenComponent;
  let fixture: ComponentFixture<CreateApproveSelltokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateApproveSelltokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApproveSelltokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
