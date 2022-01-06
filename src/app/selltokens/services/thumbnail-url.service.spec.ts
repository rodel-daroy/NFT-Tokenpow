import { TestBed } from '@angular/core/testing';

import { ThumbnailUrlService } from './thumbnail-url.service';

describe('ThumbnailUrlService', () => {
  let service: ThumbnailUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThumbnailUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
