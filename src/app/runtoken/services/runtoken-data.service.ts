import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { IRunToken } from '../models/runtoken.model';

@Injectable()
export class RunTokenDataService {

  private runTokenData = new BehaviorSubject<IRunToken>({});
  currentTokenData = this.runTokenData.asObservable();

  changeState(runToken: IRunToken): void {
    this.runTokenData.next(runToken);
  }
}
