import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IRunNft} from '../models/runnft.model';

@Injectable()
export class RunNftDataService {

  private runNftData = new BehaviorSubject<IRunNft>({});
  currentNftData = this.runNftData.asObservable();

  changeState(runnft: IRunNft): void {
    this.runNftData.next(runnft);
  }
}
