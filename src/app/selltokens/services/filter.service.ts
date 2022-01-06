import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class FilterService {

  private filter = new BehaviorSubject<string[]>([]);
  currentFilter = this.filter.asObservable();

  constructor() { }

  changeState(filter: string[]): void {
    this.filter.next(filter);
  }
}
