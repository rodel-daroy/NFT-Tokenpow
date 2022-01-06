import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuctionSelltokenComponent } from './create-auction-selltoken.component';

xdescribe('CreateAuctionSelltokenComponent', () => {
  let component: CreateAuctionSelltokenComponent;
  let fixture: ComponentFixture<CreateAuctionSelltokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAuctionSelltokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAuctionSelltokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
