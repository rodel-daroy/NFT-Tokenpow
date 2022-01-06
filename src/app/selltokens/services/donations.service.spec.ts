import { TestBed } from '@angular/core/testing';

import { DonationsService } from './donations.service';

xdescribe('DonationsService', () => {
  let service: DonationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
