import { TestBed } from '@angular/core/testing';

import { ShortLinkService } from './short-link.service';

xdescribe('ShortLinkService', () => {
  let service: ShortLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortLinkService);
  });

  xit('should be created', () => {
    expect(service).toBeTruthy();
  });
});
