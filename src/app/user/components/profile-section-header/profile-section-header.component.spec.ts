import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSectionHeaderComponent } from './profile-section-header.component';
import {ButtonModule} from 'primeng/button';

xdescribe('ProfileSectionHeaderComponent', () => {
  let component: ProfileSectionHeaderComponent;
  let fixture: ComponentFixture<ProfileSectionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSectionHeaderComponent ],
      imports: [ButtonModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
