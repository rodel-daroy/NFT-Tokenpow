import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThumbnailUrlService {

  private url = new BehaviorSubject<string>('');
  currentUrl = this.url.asObservable();

  constructor() { }

  changeUrl(url: string): void {
    this.url.next(url);
  }
}
