import { TestBed } from '@angular/core/testing';

import { MoneyButtonService } from './money-button.service';

xdescribe('MoneyButtonService', () => {
  let service: MoneyButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoneyButtonService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
