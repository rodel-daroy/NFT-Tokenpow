import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesActivatedService {

  private state = new BehaviorSubject<boolean>(false);
  currentState = this.state.asObservable();

  constructor() { }

  changeState(state: boolean): void {
    this.state.next(state);
  }

  getValue(): boolean {
    return this.state.getValue();
  }
}
