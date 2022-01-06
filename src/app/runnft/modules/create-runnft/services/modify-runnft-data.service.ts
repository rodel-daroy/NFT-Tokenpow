import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IRunNft} from '../../../models/runnft.model';

@Injectable({ providedIn: 'root' })
export class ModifyRunNftDataService {

  private runNftData = new BehaviorSubject<IRunNft>({});
  currentRunNftData = this.runNftData.asObservable();
 
  changeState(assets: IRunNft): void {
      console.log("current asset is");
      console.log(assets);
    this.runNftData.next(assets);
  }
}
