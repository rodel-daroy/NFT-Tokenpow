import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IRunToken} from '../../../models/runtoken.model';

@Injectable({ providedIn: 'root' })
export class ModifyRunTokenDataService {

  private assetData = new BehaviorSubject<IRunToken>({});
  currentRunTokenData = this.assetData.asObservable();
 
  changeState(assets: IRunToken): void {
      console.log("current asset is");
      console.log(assets);
    this.assetData.next(assets);
  }
}
