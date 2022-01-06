import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IRunToken} from '../../../models/runtoken.model';

@Injectable({providedIn: 'root'})
export class CreateRunTokenDataService {

  private assetData = new BehaviorSubject<IRunToken>({});
  currentRunTokenData = this.assetData.asObservable();

  changeState(assets: IRunToken): void {
    this.assetData.next(assets);
  }
}
