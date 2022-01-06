import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelltokenApprovalsComponent } from './selltoken-approvals.component';
import {ButtonModule} from 'primeng/button';

xdescribe('SelltokenApprovalsComponent', () => {
  let component: SelltokenApprovalsComponent;
  let fixture: ComponentFixture<SelltokenApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelltokenApprovalsComponent],
      imports: [ButtonModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelltokenApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
