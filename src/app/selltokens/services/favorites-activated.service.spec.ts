import { TestBed } from '@angular/core/testing';

import { FavoritesActivatedService } from './favorites-activated.service';

describe('FavoritesActivatedService', () => {
  let service: FavoritesActivatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesActivatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true', () => {
    service.changeState(true);
    expect(service.getValue()).toBe(true);
  });

  it('should return false', () => {
    service.changeState(false);
    expect(service.getValue()).toBe(false);
  });

  it('should return false', () => {
    expect(service.getValue()).toBe(false);
  });
});
