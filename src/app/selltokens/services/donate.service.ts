import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

export interface SharedselltokenUserInfo {
  address?: string;
  userId?: string;
  userEmail?: string;
}

@Injectable()
export class DonateService {

  private state = new BehaviorSubject<SharedselltokenUserInfo>({});
  currentState = this.state.asObservable();

  constructor() { }

  changeState(sharedselltokenUserInfo: SharedselltokenUserInfo): void {
    this.state.next(sharedselltokenUserInfo);
  }

  getValue(): SharedselltokenUserInfo {
    return this.state.getValue();
  }
}
