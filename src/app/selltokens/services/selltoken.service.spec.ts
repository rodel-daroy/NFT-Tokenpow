import { SelltokenService } from './selltoken.service';
import {TestBed} from '@angular/core/testing';
import {AppModule} from '../../app.module';
import {ISelltoken} from '../models/selltoken.model';

describe('SelltokenService', () => {
  let service: SelltokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
    service = TestBed.inject(SelltokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should ')
});
